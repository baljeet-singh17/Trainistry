
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/TrainerDashboard.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // New States for Connections Modal
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "Followers" or "Following"

  const [editData, setEditData] = useState({
    bio: "",
    location: "",
    expertise: "",
    experienceYears: 0,
    availability: "available"
  });

  const [resumeFile, setResumeFile] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API_BASE_URL = "http://localhost:5000";

  // HELPER: Fixes paths and prevents about:blank#blocked
  // Updated Helper: Prevents doubling of the URL
const getCleanUrl = (path) => {
  if (!path) return null;

  // 1. If it's already a full URL, just return it (after fixing backslashes)
  if (path.startsWith("http")) {
    return path.replace(/\\/g, "/");
  }

  // 2. Otherwise, clean the path and append the base URL
  const cleanPath = path.replace(/\\/g, "/").replace(/^src[\\/]/, "");
  
  // Ensure we don't end up with // in the middle (e.g. http://localhost:5000//uploads)
  const separator = cleanPath.startsWith("/") ? "" : "/";
  
  return `${API_BASE_URL}${separator}${cleanPath}`;
};

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/trainer/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data.data);
      } catch (err) {
        console.error("Error fetching profile", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, navigate]);

  const openEditModal = () => {
    const expertiseValue = Array.isArray(profile.expertise)
      ? profile.expertise.join(", ")
      : (profile.expertise || "");

    setEditData({
      bio: profile.bio || "",
      location: profile.location || "",
      expertise: expertiseValue,
      experienceYears: profile.experienceYears || 0,
      availability: profile.availability || "available"
    });
    setResumeFile(null);
    setIsEditModalOpen(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("bio", editData.bio);
      formData.append("location", editData.location);
      formData.append("experienceYears", Number(editData.experienceYears) || 0);
      formData.append("availability", editData.availability);

      const expertiseArray = editData.expertise
        .split(",")
        .map(item => item.trim())
        .filter(item => item !== "");

      formData.append("expertise", JSON.stringify(expertiseArray));
      if (resumeFile) formData.append("resume", resumeFile);

      const config = { 
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        } 
      };
      
      const res = await axios.put(`${API_BASE_URL}/api/trainer/profile`, formData, config);

      setProfile(res.data.data);
      setIsEditModalOpen(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div className="loader">Loading Profile...</div>;
  if (!profile) return <div className="error-container"><button onClick={() => navigate("/login")}>Go to Login</button></div>;

  return (
    <div className="trainer-dashboard">
      <aside className="sidebar">
        <div className="logo">Trainistry</div>
        <nav>
          <button className="sidebar-btn" onClick={() => navigate("/trainer-dashboard")}>Find Projects</button>
          <button className="sidebar-btn" onClick={() => navigate("/trainer/network")}>Industrial Network</button>
          <button className="sidebar-btn" onClick={() => navigate("/trainer/applications")}>Applications</button>
          <button className="sidebar-btn active">My Profile</button>
        </nav>
        <button className="logout-btn" onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>Logout</button>
      </aside>

      <main className="main-content">
        <header className="header-section">
          <h1>My Professional Profile</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="apply-btn" style={{ width: 'auto', background: '#10b981' }} onClick={() => navigate("/trainer/network")}>Post Achievement</button>
            <button className="apply-btn" style={{ width: 'auto' }} onClick={openEditModal}>Edit Profile</button>
          </div>
        </header>

        <div className="profile-layout">
          <div className="stat-card glass profile-main-card">
            <div className="profile-header-flex">
              <div className="profile-avatar-circle">{profile.user?.name?.charAt(0) || "T"}</div>
              <div className="profile-intro">
                <h2>{profile.user?.name || "Professional Trainer"}</h2>
                <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0' }}>Student at Chitkara University</p>
                <div className="expertise-tags" style={{ marginTop: '10px' }}>
                  {Array.isArray(profile.expertise)
                    ? profile.expertise.map((skill, i) => (
                      <span key={i} className="skill-badge" style={{ marginRight: '5px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid #3b82f6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{skill}</span>
                    ))
                    : <span className="skill-badge">New Trainer</span>}
                </div>
              </div>

              <div className="social-stats" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div 
                  className="stat-item" 
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => { setModalType("Followers"); setShowConnectionsModal(true); }}
                >
                  <span style={{ display: 'block', fontWeight: 'bold', fontSize: '18px' }}>{profile.user?.followers?.length || 0}</span>
                  <small style={{ color: '#64748b' }}>Followers</small>
                </div>
                <div 
                  className="stat-item" 
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => { setModalType("Following"); setShowConnectionsModal(true); }}
                >
                  <span style={{ display: 'block', fontWeight: 'bold', fontSize: '18px' }}>{profile.user?.following?.length || 0}</span>
                  <small style={{ color: '#64748b' }}>Following</small>
                </div>
                <div className="stat-pill like">👍 {profile.likes || 0}</div>
              </div>
            </div>
          </div>

          <div className="profile-grid">
            <div className="profile-left">
              <section className="stat-card glass bio-section">
                <h3>About Me</h3>
                <p>{profile.bio || "Click Edit to add your professional summary."}</p>
              </section>

              <section className="stat-card glass feedback-section">
                <h3>Company Feedback</h3>
                <div className="feedback-list">
                  {profile.feedbacks?.length > 0 ? profile.feedbacks.map((f, index) => (
                    <div key={index} className="feedback-card">
                      <p className="feedback-text">"{f.comment}"</p>
                      <span className="student-name">— {f.sender?.name || "Verified Client"}</span>
                    </div>
                  )) : <div className="empty-state"><p>No company reviews yet.</p></div>}
                </div>
              </section>
            </div>

            <div className="profile-right">
              <div className="stat-card glass detail-box">
                <h3>Quick Details</h3>
                <div className="info-row" style={{ marginBottom: '20px' }}>
                  <span className="label">Current Status</span>
                  <button className={`status-pill-btn ${profile.availability}`}>
                    <span className="status-dot"></span>
                    {profile.availability === 'available' ? 'Available for Hire' : 'Currently Busy'}
                  </button>
                </div>
                <div className="info-row">
                  <div className="detail-item">
                    <span className="label">Experience</span>
                    <span className="value-large">{profile.experienceYears || 0} <small>Years</small></span>
                  </div>
                </div>
                <hr className="divider" />
                <div className="resume-section">
                  <span className="label" style={{ display: 'block', marginBottom: '12px' }}>Professional Resume</span>
                  {profile.resumeUrl ? (
                    <button 
                      onClick={() => window.open(getCleanUrl(profile.resumeUrl), "_blank", "noopener,noreferrer")}
                      className="resume-download-btn" 
                      style={{ border: 'none', cursor: 'pointer', width: '100%', textAlign: 'center', background: '#3b82f6', color: 'white', padding: '10px', borderRadius: '8px' }}
                    >
                      📄 View Document
                    </button>
                  ) : <div className="resume-placeholder">No resume uploaded</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Connections Modal (Followers/Following) */}
      {showConnectionsModal && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '400px', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0 }}>{modalType}</h3>
              <button onClick={() => setShowConnectionsModal(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <div className="connections-list" style={{ maxHeight: '350px', overflowY: 'auto' }}>
              {profile.user[modalType.toLowerCase()]?.length > 0 ? (
                profile.user[modalType.toLowerCase()].map((person) => (
                  <div key={person._id} className="connection-item" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="author-img-circle" style={{ width: '40px', height: '40px', fontSize: '16px', background: '#3b82f6' }}>
                      {person.name?.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: '600', color: 'white' }}>{person.name}</p>
                      <small style={{ color: '#64748b', textTransform: 'capitalize' }}>{person.role}</small>
                    </div>
                    <button className="sidebar-btn" style={{ width: 'auto', padding: '4px 12px', fontSize: '12px', background: 'rgba(255,255,255,0.05)' }} onClick={() => navigate(`/trainer/profile/${person._id}`)}>View</button>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <p style={{ color: '#64748b' }}>No {modalType.toLowerCase()} found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <h3>Edit Professional Profile</h3>
            <form onSubmit={handleUpdateProfile}>
              <div className="form-group"><label>Expertise (comma separated)</label><input type="text" value={editData.expertise} onChange={(e) => setEditData({ ...editData, expertise: e.target.value })} /></div>
              <div className="form-group"><label>Location</label><input type="text" value={editData.location} onChange={(e) => setEditData({ ...editData, location: e.target.value })} /></div>
              <div className="form-group"><label>Years of Experience</label><input type="number" value={editData.experienceYears} onChange={(e) => setEditData({ ...editData, experienceYears: e.target.value })} /></div>
              <div className="form-group"><label>Bio</label><textarea rows="4" value={editData.bio} onChange={(e) => setEditData({ ...editData, bio: e.target.value })} /></div>
              <div className="form-group"><label>Upload Resume (PDF)</label><input type="file" accept=".pdf" onChange={(e) => setResumeFile(e.target.files[0])} /></div>
              <div className="modal-actions">
                <button type="button" className="logout-btn" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="apply-btn" disabled={isUpdating}>{isUpdating ? "Saving..." : "Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;