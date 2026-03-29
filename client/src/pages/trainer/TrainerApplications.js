
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/TrainerDashboard.css";

function TrainerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchApplications();
  }, [token, navigate]);

  const fetchApplications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/trainer/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data.data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const getPaymentInfo = (project, app) => {
    // If already paid, return a cleared status
    if (app.paymentStatus === 'cleared') return { isPaid: true, transactionId: app.transactionId };
    
    if (project.status !== 'completed' || !project.paymentDeadline) return null;
    const deadline = new Date(project.paymentDeadline);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { isPaid: false, days: diffDays, date: deadline.toLocaleDateString('en-IN') };
  };

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/trainer/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(applications.filter(app => app._id !== applicationId));
    } catch (error) {
      alert("Failed to withdraw.");
    }
  };

  const handleMarkDisputed = async (applicationId) => {
    if (!window.confirm("Mark this project as disputed? This notifies the company.")) return;
    try {
      await axios.put(`http://localhost:5000/api/trainer/applications/${applicationId}/dispute`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Project marked as Disputed.");
      fetchApplications();
    } catch (error) {
      alert("Failed to mark dispute. Check your backend routes.");
    }
  };

  const handlePostWarning = async (app) => {
    const confirmWarning = window.confirm("This will post a PUBLIC warning and drop the Trust Score. Proceed?");
    if (!confirmWarning) return;

    try {
      await axios.post("http://localhost:5000/api/posts", {
        title: `⚠️ Payment Warning: ${app.project.title}`,
        content: `Payment is overdue for the project "${app.project.title}". Industrial window exceeded.`,
        postType: 'warning',
        relatedCompany: app.project.company._id || app.project.company,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Warning posted! Trust Score updated.");
      fetchApplications();
    } catch (err) {
      console.error("Post Error:", err.response?.data);
      alert(err.response?.data?.message || "Error posting warning.");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="trainer-dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo">Trainistry</div>
        <nav className="nav-menu">
          <button className="sidebar-btn" onClick={() => navigate("/trainer-dashboard")}>Find Projects</button>
          <button className="sidebar-btn" onClick={() => navigate("/trainer/network")}>Industrial Network</button>
          <button className="sidebar-btn active">My Applications</button>
          <button className="sidebar-btn" onClick={() => navigate("/trainer/profile")}>My Profile</button>
        </nav>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </aside>

      <main className="main-content">
        <header className="dashboard-header"><h1>My Applications</h1></header>
        <div className="applications-grid">
          {applications.map((app) => {
            const project = app.project || {};
            const budget = project.perDayPayment * project.durationDays || "N/A";
            const payInfo = getPaymentInfo(project, app);

            return (
              <div key={app._id} className={`application-card glass ${app.status === 'selected' ? 'border-success' : ''}`}>
                <div className="app-card-header">
                  <h3>{project.title}</h3>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {app.paymentStatus === 'cleared' && <span className="status-badge" style={{ backgroundColor: '#10b981' }}>PAID</span>}
                    {app.isDisputed && app.paymentStatus !== 'cleared' && <span className="status-badge" style={{ backgroundColor: '#ef4444' }}>DISPUTED</span>}
                    <span className={`status-badge status-${app.status?.toLowerCase()}`}>{app.status}</span>
                  </div>
                </div>

                <div className="project-details">
                   <div className="detail-item"><span className="detail-label">Company</span><span className="detail-value">{project.company?.name}</span></div>
                   <div className="detail-item"><span className="detail-label">Total Budget</span><span className="detail-value">₹{budget}</span></div>
                </div>

                {payInfo && (
                  <div className="payment-tag" style={{ 
                    margin: '15px 0', 
                    padding: '10px', 
                    borderRadius: '5px', 
                    backgroundColor: payInfo.isPaid ? '#d1fae5' : '#fef3c7',
                    color: payInfo.isPaid ? '#065f46' : '#92400e',
                    border: payInfo.isPaid ? '1px solid #10b981' : 'none'
                  }}>
                    {payInfo.isPaid ? (
                        <>✅ Payment Received (Ref: <strong>{payInfo.transactionId}</strong>)</>
                    ) : (
                        <>💰 Payment Expected: <strong>{payInfo.date}</strong></>
                    )}
                  </div>
                )}

                <div className="card-footer" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                  {/* Hide dispute buttons if payment is cleared */}
                  {app.status === 'completed' && !app.isDisputed && app.paymentStatus !== 'cleared' && (
                    <button className="btn-outline-danger" onClick={() => handleMarkDisputed(app._id)}>
                      ⚠️ Mark Disputed
                    </button>
                  )}

                  {app.isDisputed && app.paymentStatus !== 'cleared' && (
                    <button className="btn-danger" style={{ backgroundColor: '#b91c1c', color: 'white' }} onClick={() => handlePostWarning(app)}>
                      📢 Warn Network (Drop Trust Score)
                    </button>
                  )}

                  <button className="withdraw-btn" disabled={app.status === 'completed' || app.paymentStatus === 'cleared'}>
                    {app.paymentStatus === 'cleared' ? "Payment Settled" : app.status === 'completed' ? "Project Finished" : "Withdraw"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default TrainerApplications;