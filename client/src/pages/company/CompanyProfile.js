
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/companyDashboard.css"; 

function CompanyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false); // New state for loading during verification

  const [editData, setEditData] = useState({
    name: "",
    industry: "",
    location: "",
    description: "",
  });
  

  const token = localStorage.getItem("token");
  const API_BASE_URL = "http://localhost:5000";

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/company/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.data);
    } catch (err) {
      console.error("Error fetching company profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // --- ADDED: Verification Toggle Function ---
  const handleVerifyToggle = async () => {
    setIsVerifying(true);
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/company/profile`, 
        { isVerified: !profile.isVerified }, // Toggle the current status
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(res.data.data);
    } catch (err) {
      alert("Failed to update verification status.");
    } finally {
      setIsVerifying(false);
    }
  };

  const openEditModal = () => {
    setEditData({
      name: profile.name || "",
      industry: profile.industry || "",
      location: profile.location || "",
      description: profile.description || "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await axios.put(`${API_BASE_URL}/api/company/profile`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.data);
      setIsEditModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!profile) return <div className="error-container">Profile not found.</div>;

  return (
    <div className="profile-wrapper">
      <header className="profile-header-main">
        <h1>Industrial Identity</h1>
        <button className="edit-details-btn" onClick={openEditModal}>
          Edit Details
        </button>
      </header>

      {/* Main Info Card */}
      <div className="profile-card main-info-card">
        <div className="profile-flex-container">
          <div className="profile-main-left">
            <div className="profile-avatar-square">
              {profile.name?.charAt(0) || "C"}
            </div>
            <div className="profile-identity-text">
              <h2>
                {profile.name} {profile.isVerified && <span className="verified-icon">🛡️</span>}
              </h2>
              <p className="subtitle">
                {profile.industry} • {profile.location}
              </p>
              <div className="badge-container">
                <span className="trust-score-badge">
                  Trust Score: {profile.trustScore}%
                </span>
              </div>
            </div>
          </div>

          <div className="profile-stats-group">
            <div className="stat-unit">
              <span className="stat-value">{profile.user?.followers?.length || 0}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-unit">
              <span className="stat-value">{profile.user?.following?.length || 0}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-grid-content">
        <div className="grid-left-side">
          <section className="profile-card sub-card">
            <h3>Corporate Overview</h3>
            <p className="description-text">
              {profile.description || "No corporate description provided yet."}
            </p>
          </section>

          <section className="profile-card sub-card">
            <h3>Trainer Testimonials</h3>
            <div className="testimonials-placeholder">
              <p>No testimonials available at the moment.</p>
            </div>
          </section>
        </div>

        <div className="grid-right-side">
          <section className="profile-card sub-card">
            <h3>Quick Info</h3>
            <div className="info-item">
              <label>VERIFICATION</label>
              {/* --- UPDATED: Verification Pill + Toggle Button --- */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`status-pill ${profile.isVerified ? "is-verified" : "is-pending"}`}>
                  {profile.isVerified ? "Verified Industrial Entity" : "Pending Verification"}
                </span>
                <button 
                  onClick={handleVerifyToggle} 
                  disabled={isVerifying}
                  style={{ 
                    fontSize: '10px', 
                    padding: '2px 6px', 
                    cursor: 'pointer',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px'
                  }}
                >
                  {isVerifying ? "..." : profile.isVerified ? "Revoke" : "Verify"}
                </button>
              </div>
            </div>
            <div className="info-item">
              <label>HEADQUARTERS</label>
              <span className="info-value">{profile.location}</span>
            </div>
            <div className="info-item">
              <label>PRIMARY INDUSTRY</label>
              <span className="industry-focus-tag">{profile.industry}</span>
            </div>
          </section>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content light-modal">
            <h3>Update Company Profile</h3>
            <form onSubmit={handleUpdateProfile}>
              <div className="input-group">
                <label>Company Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label>Industry</label>
                <input
                  type="text"
                  value={editData.industry}
                  onChange={(e) => setEditData({ ...editData, industry: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label>Location</label>
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea
                  rows="4"
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyProfile;