
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/companyDashboard.css";

function ProjectApplications() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [interviewData, setInterviewData] = useState({ date: "", time: "", link: "" });

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const API_BASE_URL = "http://localhost:5000";

  const handleViewResume = (e, resumePath) => {
    e.preventDefault();
    if (!resumePath) return alert("No resume found.");
    let finalUrl = resumePath.startsWith("http") ? resumePath : `${API_BASE_URL}${resumePath.replace(/\\/g, "/")}`;
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    const fetchApplications = async () => {
      if (!companyId || !projectId) return;
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/company/${companyId}/projects/${projectId}/applications`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setApplications(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [projectId, companyId, token]);

  const updateStatus = async (applicationId, status) => {
    const feedback = status === 'rejected' ? window.prompt("Optional feedback for the trainer:") : null;
    if (!window.confirm(`Confirm application ${status}?`)) return;

    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/company/applications/${applicationId}/status`,
        { status, feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications((prev) => prev.map((app) => (app._id === applicationId ? { ...app, status } : app)));
      alert(`Trainer notified via email about ${status} status.`);
    } catch (err) {
      alert("Error updating status.");
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_BASE_URL}/api/company/applications/${selectedApp._id}/status`,
        { 
          status: "interview_scheduled",
          date: interviewData.date,
          time: interviewData.time,
          link: interviewData.link
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setApplications((prev) => prev.map((app) => app._id === selectedApp._id ? { ...app, status: "interview_scheduled" } : app));
      alert("Interview scheduled and trainer notified via email!");
      setShowModal(false);
    } catch (err) {
      alert("Failed to schedule interview.");
    }
  };

  if (loading) return <div className="loading-text">Loading applications...</div>;

  return (
    <div className="company-dashboard">
      <div className="main-content" style={{ marginLeft: "0", padding: "40px" }}>
        <div className="dashboard-header">
          <button className="back-link" onClick={() => navigate(-1)}>← Back to Projects</button>
          <h1 style={{ marginTop: "15px" }}>Trainer Applications</h1>
        </div>

        <div className="applications-grid">
          {applications.length === 0 ? (
            <div className="dashboard-card glass full-width"><p>No applications received yet.</p></div>
          ) : (
            applications.map((app) => (
              <div key={app?._id} className="application-card glass">
                <div className="app-card-header">
                  <div className="trainer-avatar">{app?.trainer?.user?.name?.charAt(0) || "T"}</div>
                  <span className={`status-badge status-${app?.status?.toLowerCase()}`}>{app?.status?.replace('_', ' ')}</span>
                </div>
                <div className="trainer-info">
                  <h3>{app?.trainer?.user?.name}</h3>
                  <p className="trainer-email">{app?.trainer?.user?.email}</p>
                </div>
                <div className="app-stats">
                  <div className="stat"><span>Expected Rate</span><strong>₹{app?.expectedRate} / day</strong></div>
                </div>
                <div className="app-footer-actions">
                  <button onClick={(e) => handleViewResume(e, app.resumeUrl)} className="resume-link-btn">📄 View Resume</button>
                  <div className="application-action-btns">
                    {app?.status === "shortlisted" || app?.status === "interview_scheduled" ? (
                      <button className="btn-primary" onClick={() => { setSelectedApp(app); setShowModal(true); }}>
                        📅 {app?.status === "interview_scheduled" ? "Reschedule" : "Schedule Interview"}
                      </button>
                    ) : app?.status !== "rejected" && (
                      <>
                        <button className="shortlist-btn" onClick={() => updateStatus(app?._id, "shortlisted")}>Shortlist</button>
                        <button className="reject-btn" onClick={() => updateStatus(app?._id, "rejected")}>Reject</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <h2>Schedule Interview</h2>
            <form onSubmit={handleScheduleInterview}>
              <div className="form-group"><label>Date</label><input type="date" className="form-input" required onChange={(e) => setInterviewData({...interviewData, date: e.target.value})}/></div>
              <div className="form-group"><label>Time</label><input type="time" className="form-input" required onChange={(e) => setInterviewData({...interviewData, time: e.target.value})}/></div>
              <div className="form-group"><label>Meeting Link</label><input type="url" className="form-input" placeholder="https://meet.google.com/..." required onChange={(e) => setInterviewData({...interviewData, link: e.target.value})}/></div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Confirm & Send Email</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectApplications;