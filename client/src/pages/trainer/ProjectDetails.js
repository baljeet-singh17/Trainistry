import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/TrainerDashboard.css";
import Notifications from "../../components/Notifications";

function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [project, setProject] = useState(null);
  const [appliedProjects, setAppliedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Fetch project details and trainer's current applications
        const [projectRes, appliedRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/projects/${projectId}`, config),
          axios.get("http://localhost:5000/api/trainer/applications", config)
        ]);

        setProject(projectRes.data.data);
        const appliedIds = appliedRes.data.data.map((app) => app.project._id);
        setAppliedProjects(appliedIds);

      } catch (err) {
        console.error("Error fetching project or applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, token, navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) return <div className="loader">Loading Project Details...</div>;
  if (!project) return <div className="error-container"><p>Project not found.</p></div>;

  const budget = project.perDayPayment && project.durationDays
    ? project.perDayPayment * project.durationDays
    : "N/A";

  const hasApplied = appliedProjects.includes(project._id);

  return (
    <div className="trainer-dashboard">
      {/* SIDEBAR - Now includes Industrial Network */}
      <aside className="sidebar">
        <div className="logo">Trainistry</div>
        <nav>
          <button className="sidebar-btn" onClick={() => navigate("/trainer-dashboard")}>
            Find Projects
          </button>
          <button className="sidebar-btn" onClick={() => navigate("/trainer/network")}>
            Industrial Network
          </button>
          <button className="sidebar-btn" onClick={() => navigate("/trainer/applications")}>
            My Applications
          </button>
          <button className="sidebar-btn" onClick={() => navigate("/trainer/profile")}>
            My Profile
          </button>
        </nav>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="header-section">
          <h1>Project Details</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Notifications token={token} />
          </div>
        </header>

        <div className="project-details-card glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>{project.title || "N/A"}</h2>
            {/* 15-Day Rule/Payment Status Badge */}
            {project.status === 'completed' && project.paymentDeadline && (
              <div className="status-pill" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #f59e0b', fontSize: '0.85rem' }}>
                Payment Due: {new Date(project.paymentDeadline).toLocaleDateString('en-IN')}
              </div>
            )}
          </div>

          {project.description && (
            <div className="description-section" style={{ marginBottom: '25px' }}>
              <h4 style={{ color: '#666', marginBottom: '10px' }}>Requirement Description</h4>
              <p className="project-description">{project.description}</p>
            </div>
          )}

          <div className="specs-grid">
            <div className="spec-item">
              <span className="spec-label">Technology Stack</span>
              <span className="spec-value">{project.technology || "N/A"}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Commercials</span>
              <span className="spec-value price-highlight">₹{project.perDayPayment}/day (Total: ₹{budget})</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Duration</span>
              <span className="spec-value">{project.durationDays ? `${project.durationDays} Days` : "N/A"}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Location</span>
              <span className="spec-value">{project.location || "Remote / On-site"}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Company Name</span>
              <span className="spec-value">{project.company?.name || "Partner Entity"}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Start Date</span>
              <span className="spec-value">
                {project.startDate ? new Date(project.startDate).toLocaleDateString('en-IN') : "Flexible"}
              </span>
            </div>
            <div className="spec-item">
              <span className="spec-label">TFA / TOC Status</span>
              <span className="spec-value">
                {project.tfaProvided ? "✅ TFA" : "❌ No TFA"} / {project.tocProvided ? "✅ TOC" : "❌ No TOC"}
              </span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Payment Terms</span>
              <span className="spec-value" style={{ color: '#059669', fontWeight: 'bold' }}>
                {project.paymentTerms || "Standard 15-Day Cycle"}
              </span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Requirement Status</span>
              <span className="spec-value" style={{ textTransform: 'capitalize', fontWeight: 'bold', color: '#2563eb' }}>
                {project.status || "Open"}
              </span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Total Applicants</span>
              <span className="spec-value">{project.applicationCount || 0} Trainers</span>
            </div>
          </div>

          <div className="action-footer" style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <button
              className={hasApplied ? "applied-btn" : "apply-btn"}
              disabled={hasApplied}
              onClick={() => navigate(`/trainer/apply/${project._id}`)}
              style={{ padding: '12px 40px', fontSize: '1rem' }}
            >
              {hasApplied ? "Application Submitted ✔" : "Apply for this Project"}
            </button>
            <button 
              className="sidebar-btn" 
              style={{ marginLeft: '15px', border: '1px solid #ddd' }}
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProjectDetails;