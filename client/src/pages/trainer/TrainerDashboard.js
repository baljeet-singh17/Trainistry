
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import "../../styles/TrainerDashboard.css"; 

function TrainerDashboard() {
  const [data, setData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    startDate: "",
    sortBy: "newest" 
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchAll = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [dashRes, projRes, appRes] = await Promise.all([
        axios.get("http://localhost:5000/api/trainer/dashboard", config),
        axios.get("http://localhost:5000/api/trainer/projects", config),
        axios.get("http://localhost:5000/api/trainer/applications", config)
      ]);
      
      setData({
        ...dashRes.data.data,
        myApplications: appRes.data.data || []
      });
      setProjects(projRes.data.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAll();
  }, [token, navigate]);

  const handleRaiseDispute = async (appId) => {
    if (!window.confirm("Raise formal dispute? Trust Score will drop by 10%.")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(
        `http://localhost:5000/api/trainer/applications/${appId}/dispute`, 
        {}, 
        config
      );
      alert("Dispute raised. Company score penalized.");
      fetchAll(); 
    } catch (err) {
      console.error("Dispute Error:", err.response?.data);
      alert(err.response?.data?.message || "Error raising dispute");
    }
  };

  const downloadInvoice = (app) => {
    const doc = new jsPDF();
    const proj = app.project;
    const duration = proj.duration || 15; 
    const totalAmount = proj.totalBudget || (proj.perDayPayment * duration);

    doc.setFontSize(22);
    doc.setTextColor(67, 56, 202); 
    doc.text("TRAINISTRY INVOICE", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString('en-IN')}`, 14, 30);
    doc.text(`Trainer: ${data.profile?.user?.name || 'Trainer'}`, 14, 35);
    doc.text(`Client: ${proj.company?.name || 'Partner Company'}`, 14, 40);

    const tableData = [[
      proj.title,
      `${duration} Days`,
      `Rs. ${proj.perDayPayment}`,
      `Rs. ${totalAmount}`,
      app.paymentStatus === 'cleared' ? "PAID" : "Completed"
    ]];

    autoTable(doc, {
      startY: 50,
      head: [['Project Title', 'Duration', 'Rate/Day', 'Total Amount', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [67, 56, 202] },
      columnStyles: { 3: { fontStyle: 'bold' } }
    });

    const finalY = doc.lastAutoTable.finalY || 70;
    doc.setFontSize(10);
    doc.text("Notes: This is a system-generated invoice for industrial training services.", 14, finalY + 10);
    doc.text(`Payment Ref: ${app.transactionId || 'Pending'}`, 14, finalY + 15);
    doc.setFontSize(11);
    doc.text("Authorized Signature:", 14, finalY + 30);
    doc.line(14, finalY + 32, 70, finalY + 32); 

    doc.save(`Invoice_${proj.title.replace(/\s+/g, '_')}.pdf`);
  };

  // UPDATED DEADLINE LOGIC: To handle the 'cleared' state
  const getDeadlineInfo = (app) => {
    const project = app.project;
    if (project?.status?.toLowerCase() !== 'completed' || !project?.paymentDeadline) return null;
    
    const deadline = new Date(project.paymentDeadline);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      id: app._id,
      days: diffDays,
      date: deadline.toLocaleDateString('en-IN'),
      isUrgent: diffDays <= 3,
      isOverdue: diffDays <= 0,
      isDisputed: app.isDisputed,
      paymentStatus: app.paymentStatus, // NEW: track payment status
      transactionId: app.transactionId  // NEW: track transaction ID
    };
  };

  const handleToggle = async () => {
    const currentStatus = data.profile?.availability;
    const newStatus = currentStatus === 'available' ? 'busy' : 'available';
    try {
      const res = await axios.put(
        "http://localhost:5000/api/trainer/toggle-status", 
        { availability: newStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(prev => ({ 
        ...prev, 
        profile: { ...prev.profile, availability: res.data.availability || newStatus } 
      }));
    } catch (err) {
      console.error("Toggle error", err);
    }
  };

  const handleWarnNetwork = async (app) => {
    const confirm = window.confirm("This will post a public warning about this company's payment delay. Proceed?");
    if (!confirm) return;

    try {
      await axios.post("http://localhost:5000/api/posts", {
        content: `⚠️ UNPAID PROJECT ALERT: ${app.project.company.name} has exceeded the 15-day payment window for "${app.project.title}". Trainers, please proceed with caution.`,
        postType: "warning",
        relatedCompany: app.project.company._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Warning shared with the Industrial Network.");
    } catch (err) {
      alert("Action failed. Try again.");
    }
  };

  const filteredProjects = projects
    .filter((proj) => {
      const searchMatch = (
        proj.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proj.technology?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proj.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const locationMatch = filters.location === "" || proj.location?.toLowerCase().includes(filters.location.toLowerCase());
      const dateMatch = filters.startDate === "" || new Date(proj.startDate) >= new Date(filters.startDate);
      return searchMatch && locationMatch && dateMatch;
    })
    .sort((a, b) => {
      if (filters.sortBy === "highest_pay") return b.perDayPayment - a.perDayPayment;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  if (loading) return <div className="loader">Loading Trainistry...</div>;

  return (
    <div className="trainer-dashboard">
      <aside className="sidebar">
        <div className="logo">Trainistry</div>
        <nav>
          <button className="sidebar-btn active">Find Projects</button>
          <button className="sidebar-btn" onClick={() => navigate("/trainer/network")}>Industrial Network</button>
          <button className="sidebar-btn" onClick={() => navigate("/trainer/applications")}>My Applications</button>
          <button className="sidebar-btn" onClick={() => navigate("/trainer/profile")}>My Profile</button>
        </nav>
        <button className="logout-btn" onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>Logout</button>
      </aside>

      <main className="main-content">
        <header className="header-section">
          <h1>Welcome, {data.profile?.user?.name || 'Trainer'}</h1>
          <div className="availability-control">
            <span className="status-label">Status:</span>
            <div className={`status-toggle-wrapper ${data.profile?.availability}`} onClick={handleToggle}>
              <div className="toggle-slider">
                <span className={`status-indicator ${data.profile?.availability}`}></span>
              </div>
              <span className="status-text">{data.profile?.availability === 'available' ? 'Available' : 'Busy'}</span>
            </div>
          </div>
        </header>

        {/* UPDATED Payment Countdown Box */}
        {data.myApplications?.some(app => getDeadlineInfo(app)) && (
          <div className="payment-alert-box glass" style={{ marginBottom: '25px', padding: '20px', borderLeft: '5px solid #4338ca' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#4338ca' }}>💳 Payment Tracking</h3>
            {data.myApplications.map(app => {
              const info = getDeadlineInfo(app);
              if (!info) return null;
              return (
                <div key={app._id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '12px 0', 
                    borderBottom: '1px solid #eee',
                    opacity: info.paymentStatus === 'cleared' ? 0.8 : 1 // Dim paid projects slightly
                }}>
                  <div>
                    <strong>{app.project.title}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        {info.paymentStatus === 'cleared' ? `Paid on: ${new Date().toLocaleDateString('en-IN')}` : `Deadline: ${info.date}`}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button 
                      onClick={() => downloadInvoice(app)}
                      style={{ padding: '5px 10px', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}
                    >
                      📄 Invoice
                    </button>
                    
                    {/* NEW LOGIC: Show Paid status if cleared */}
                    {info.paymentStatus === 'cleared' ? (
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>✅ Paid</span>
                        <div style={{ fontSize: '0.7rem', color: '#666' }}>ID: {info.transactionId}</div>
                      </div>
                    ) : info.isDisputed ? (
                      <span style={{ color: '#ef4444', fontWeight: 'bold' }}>⚠️ Under Dispute</span>
                    ) : info.isOverdue ? (
                      <button 
                        onClick={() => handleRaiseDispute(info.id)}
                        style={{ padding: '5px 10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Raise Dispute
                      </button>
                    ) : (
                      <span style={{ color: info.isUrgent ? '#ef4444' : '#f59e0b', fontWeight: 'bold' }}>
                        {info.days > 0 ? `Payment in ${info.days} days` : "Due Today"} 
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card glass"><h4>Applied</h4><span className="value">{data.stats?.totalApplications || 0}</span></div>
          <div className="stat-card glass"><h4>Interviews</h4><span className="value">{data.stats?.interviews || 0}</span></div>
          <div className="stat-card glass"><h4>Accepted</h4><span className="value">{data.stats?.accepted || 0}</span></div>
        </div>

        <section className="section-title search-header">
          <h2>Latest Industrial Requirements</h2>
          <div className="search-controls">
            <div className="search-wrapper">
              <input 
                type="text" className="search-input" placeholder="Search tech, title, or company..." 
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
            
            <div className="filter-container">
              <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
                <span className="filter-icon">⚙️</span> Filters
              </button>
              
              {showFilters && (
                <div className="filter-dropdown glass">
                  <div className="filter-group">
                    <label>Location</label>
                    <input 
                      type="text" placeholder="e.g. Remote" className="filter-input"
                      value={filters.location} onChange={(e) => setFilters({...filters, location: e.target.value})}
                    />
                  </div>
                  <div className="filter-group">
                    <label>Starting After</label>
                    <input 
                      type="date" className="filter-input"
                      value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                    />
                  </div>
                  <div className="filter-group">
                    <label>Sort By</label>
                    <select value={filters.sortBy} onChange={(e) => setFilters({...filters, sortBy: e.target.value})}>
                      <option value="newest">Newest First</option>
                      <option value="highest_pay">Highest Pay (₹)</option>
                    </select>
                  </div>
                  <button className="clear-filters" onClick={() => setFilters({location: "", startDate: "", sortBy: "newest"})}>Reset</button>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="projects-container">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(proj => (
              <div key={proj._id} className="project-card">
                <span className="company-badge">{proj.company?.name || 'Partner'}</span>
                <h3>{proj.title}</h3>
                <p><strong>Tech:</strong> {proj.technology}</p>
                <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="status-pill pending">₹{proj.perDayPayment}/day</span>
                  <button className="apply-btn" onClick={() => navigate(`/trainer/project/${proj._id}`)}>View Details</button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results-msg">No projects match your current filters.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default TrainerDashboard;