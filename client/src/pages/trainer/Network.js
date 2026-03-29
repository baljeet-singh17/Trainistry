
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/TrainerDashboard.css"; 
import "../../styles/Network.css";

function Network() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [followingList, setFollowingList] = useState([]); 
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  
  const [newPost, setNewPost] = useState({
    description: "",
    category: "Project Completion",
    companyName: "",
  });

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");
  const API_BASE_URL = "http://localhost:5000";

  const getImageUrl = (path) => {
    if (!path) return null;
    let cleanPath = path.replace(/\\/g, "/");
    if (cleanPath.startsWith("src/")) {
      cleanPath = cleanPath.replace("src/", "");
    }
    return `${API_BASE_URL}/${cleanPath}`;
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    if (query.length > 2) {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/trainer/search?name=${query}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSearchResults(res.data.data);
      } catch (err) { console.error("Search error", err); }
    } else {
      setSearchResults([]);
    }
  };

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [postRes, userRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/achievements`),
        axios.get(`${API_BASE_URL}/api/trainer/me`, config) 
      ]);
      
      setAchievements(postRes.data.data || []);
      
      const following = userRes.data?.data?.user?.following || [];
      setFollowingList(following.map(f => typeof f === 'object' ? f._id : f));
    } catch (err) { 
      console.error("Error fetching network data", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUser(payload);
    } catch (e) { console.error("Token decoding failed", e); }
    fetchData();
  }, [token, navigate]);

  const handleFollow = async (targetUserId) => {
    if (!targetUserId) return alert("User ID not found.");
    try {
      const res = await axios.put(`${API_BASE_URL}/api/trainer/follow/${targetUserId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        if (res.data.isFollowing) {
          setFollowingList(prev => [...prev, targetUserId]);
        } else {
          setFollowingList(prev => prev.filter(id => id !== targetUserId));
        }
      }
    } catch (err) {
      console.error("Follow error:", err);
      alert("Could not update connection.");
    }
  };

  const handleLike = async (id) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/api/achievements/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAchievements(achievements.map(a => a._id === id ? { ...a, likes: res.data.likes } : a));
    } catch (err) { console.error(err); }
  };

  const handleCommentSubmit = async (id) => {
    if (!commentText.trim()) return;
    try {
      const res = await axios.post(`${API_BASE_URL}/api/achievements/${id}/comment`, { text: commentText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAchievements(achievements.map(a => a._id === id ? { ...a, comments: res.data.data } : a));
      setCommentText("");
    } catch (err) { console.error(err); }
  };

  const handleRepost = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/api/achievements/${id}/repost`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      alert("Post Shared to your feed!");
    } catch (err) { console.error(err); }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", newPost.description);
    formData.append("category", newPost.category);
    formData.append("companyName", newPost.companyName);
    if (selectedFile) formData.append("postImage", selectedFile);

    try {
      await axios.post(`${API_BASE_URL}/api/achievements`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          "Content-Type": "multipart/form-data" 
        }
      });
      setShowPostModal(false);
      setSelectedFile(null); 
      setPreviewUrl(null);
      setNewPost({ description: "", category: "Project Completion", companyName: "" });
      fetchData();
    } catch (err) { alert("Error posting milestone."); }
  };

  return (
    <div className="trainistry-network-container">
      <aside className="sidebar">
        <div className="logo">Trainistry</div>
        <nav className="nav-menu">
          <button className="sidebar-btn" onClick={() => navigate("/trainer-dashboard")}>Find Projects</button>
          <button className="sidebar-btn active">Industrial Network</button>
          <button className="sidebar-btn" onClick={() => navigate("/trainer/applications")}>Applications</button>
          <button className="sidebar-btn" onClick={() => navigate("/trainer/profile")}>My Profile</button>
        </nav>
        <button className="logout-btn" onClick={() => { localStorage.clear(); navigate("/login"); }}>Logout</button>
      </aside>

      <main className="network-content">
        <div className="search-container" style={{ marginBottom: '20px', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search trainers by name..." 
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: '100%', padding: '12px 20px', borderRadius: '25px', border: '1px solid #e0e0e0' }}
          />
          {searchResults.length > 0 && (
            <div className="search-dropdown" style={{ position: 'absolute', top: '50px', width: '100%', background: 'white', zIndex: 1000, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              {searchResults.map(profile => (
                <div key={profile._id} className="search-item" style={{ padding: '10px 20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
                  <span>{profile.user?.name}</span>
                  <button 
                    onClick={() => handleFollow(profile.user?._id)}
                    style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: '600', cursor: 'pointer' }}
                  >
                    {followingList.includes(profile.user?._id) ? "✓ Connected" : "+ Connect"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="post-trigger-box">
          <div className="user-avatar-small">{currentUser?.name?.charAt(0) || "T"}</div>
          <button onClick={() => setShowPostModal(true)}>Share a project completion or certificate...</button>
        </div>

        <div className="main-feed">
          {loading ? (
            <div className="network-loader">Loading...</div>
          ) : achievements.length === 0 ? (
            <div className="no-posts">No posts yet. Start the conversation!</div>
          ) : achievements.map((post) => {
            const postUserId = post.trainer?.user?._id || post.trainer?.user || post.trainer?._id;
            const isMe = postUserId === currentUser?.id;

            return (
              <div key={post._id} className="pro-post-card">
                <div className="post-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="author-img-circle">{post.trainer?.name?.charAt(0) || "U"}</div>
                    <div className="author-details">
                      <strong style={{ display: 'block' }}>{post.trainer?.name || "Unknown Trainer"}</strong>
                      <span className="post-meta-sub">{post.category} at {post.companyName}</span>
                    </div>
                  </div>

                  {/* Connect Button logic next to post */}
                  {!isMe && postUserId && (
                    <button 
                      onClick={() => handleFollow(postUserId)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#3b82f6', 
                        fontWeight: '700', 
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      {followingList.includes(postUserId.toString()) ? '✓ Connected' : '+ Connect'}
                    </button>
                  )}
                </div>

                <div className="post-text"><p>{post.description}</p></div>
                
                {post.imageUrl && (
                  <div className="post-media">
                    <img src={getImageUrl(post.imageUrl)} alt="Post Milestone" />
                  </div>
                )}
                
                <div className="post-stats">
                  <span>{post.likes?.length || 0} Likes</span> • <span>{post.comments?.length || 0} Comments</span>
                </div>

                <div className="post-interact">
                  <button className={`interact-btn ${post.likes?.includes(currentUser?.id) ? 'active-like' : ''}`} onClick={() => handleLike(post._id)}>
                    {post.likes?.includes(currentUser?.id) ? '❤️ Liked' : '👍 Like'}
                  </button>
                  <button className="interact-btn" onClick={() => setActiveCommentId(activeCommentId === post._id ? null : post._id)}>💬 Comment</button>
                  <button className="interact-btn" onClick={() => handleRepost(post._id)}>🔄 Repost</button>
                  <button className="interact-btn" onClick={() => { navigator.clipboard.writeText(post.description); alert("Text Copied!"); }}>✈️ Copy</button>
                </div>

                {activeCommentId === post._id && (
                  <div className="comment-box">
                    <div className="comment-input">
                      <input 
                        type="text" 
                        placeholder="Write a comment..." 
                        value={commentText} 
                        onChange={(e) => setCommentText(e.target.value)} 
                      />
                      <button onClick={() => handleCommentSubmit(post._id)}>Post</button>
                    </div>
                    {post.comments?.map((c, i) => (
                      <div key={i} className="comment-item"><strong>{c.name}</strong>: {c.text}</div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {showPostModal && (
        <div className="modern-modal-overlay">
          <div className="modern-modal">
            <div className="modal-head">
              <h3>Share Achievement</h3>
              <button onClick={() => setShowPostModal(false)}>&times;</button>
            </div>
            <form onSubmit={handlePostSubmit}>
              <div className="modal-body">
                <select className="modal-select" value={newPost.category} onChange={(e) => setNewPost({...newPost, category: e.target.value})}>
                  <option>Project Completion</option>
                  <option>Certification</option>
                  <option>Workshop</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Company/University name" 
                  className="modal-input" 
                  value={newPost.companyName}
                  onChange={(e) => setNewPost({...newPost, companyName: e.target.value})} 
                />
                <textarea 
                  placeholder="Describe your milestone..." 
                  className="modal-textarea" 
                  value={newPost.description}
                  onChange={(e) => setNewPost({...newPost, description: e.target.value})} 
                  required 
                />
                {previewUrl && <div className="modal-preview"><img src={previewUrl} alt="Preview" /></div>}
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => fileInputRef.current.click()}>📷 Photo</button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  hidden 
                  accept="image/*" 
                  onChange={(e) => { 
                    const file = e.target.files[0];
                    if (file) {
                      setSelectedFile(file); 
                      setPreviewUrl(URL.createObjectURL(file));
                    }
                  }} 
                />
                <button type="submit" className="post-submit-btn">Post to Network</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Network;