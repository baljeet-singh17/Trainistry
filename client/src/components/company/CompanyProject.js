
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/companyDashboard.css";

function CompanyProjects({ companyId, refreshFlag }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchProjects = async () => {
      if (!companyId) return;
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/company/${companyId}/projects`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProjects(res.data.data || []);
      } catch (err) {
        console.error("Error fetching projects:", err.response || err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [companyId, refreshFlag, token]);

  /**
   * UPDATED: Fixed casing to 'completed' to match Mongoose Enum
   * and added immediate local state update to hide the button.
   */
  const handleMarkCompleted = async (projectId) => {
    if (!window.confirm("Are you sure? This will notify the trainer and start the 15-day payment window.")) return;

    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/company/projects/${projectId}/status`,
        { status: "completed" }, // Lowercase to match backend Enum
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("Project marked as Completed. Payment deadline set for 15 days from now.");
        
        // REFRESH LOCAL STATE: Immediately update the list to hide the button
        setProjects((prev) =>
          prev.map((p) => (p._id === projectId ? { ...p, status: "completed" } : p))
        );
      }
    } catch (err) {
      console.error("Error updating project status:", err);
      const errorMsg = err.response?.data?.message || "Failed to update status.";
      alert(errorMsg);
    }
  };

  if (loading) return <div className="loading-text">Loading your projects...</div>;

  if (!projects.length) {
    return (
      <div className="dashboard-card glass" style={{ textAlign: "center" }}>
        <p>You haven't posted any requirements yet.</p>
      </div>
    );
  }

  return (
    <div className="projects-grid">
      {projects.map((project) => (
        <div key={project._id} className="project-card glass">
          <div className="project-card-header">
            {/* Logic: Handle both 'completed' and 'Completed' for badge display */}
            <span className={`status-badge status-${project.status?.toLowerCase() || "open"}`}>
              {project.status || "Open"}
            </span>
            <p className="project-date">
              Posted: {new Date(project.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>

          {/* <h3 className="project-title">{project.technology}</h3> */}
        <h3 className="project-title">{project.title || project.technology}</h3>
          
          <div className="project-details">
            <div className="detail-item">
              <span className="detail-label">Location:</span>
              <span className="detail-value">{project.location || "Remote"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Starts:</span>
              <span className="detail-value">
                {project.startDate ? new Date(project.startDate).toLocaleDateString() : "TBD"}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Duration:</span>
              <span className="detail-value">{project.durationDays} Days</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Budget:</span>
              <span className="detail-value">₹{project.perDayPayment} /day</span>
            </div>
          </div>

          <div className="project-card-footer" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button
              className="view-applications-btn"
              style={{ flex: 1 }}
              onClick={() => navigate(`/company/project/${project._id}/applications`)}
            >
              View Applications 
            </button>

            {/* UI FIX: Only show button if status is NOT completed (case-insensitive check) */}
            {project.status?.toLowerCase() !== "completed" && (
              <button
                className="btn-primary"
                style={{ flex: 1, backgroundColor: '#4f46e5', color: 'white' }}
                onClick={() => handleMarkCompleted(project._id)}
              >
                Mark Completed
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CompanyProjects;