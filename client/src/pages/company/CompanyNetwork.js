
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../../styles/companyDashboard.css"; 
import "../../styles/Network.css"; 

function CompanyNetwork() {
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

  // UPDATED: Standardized search to use params object for reliability
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    if (query.trim().length > 2) {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/company/search`, {
          params: { name: query.trim() },
          headers: { Authorization: `Bearer ${token}` }
        });
        setSearchResults(res.data.data || []);
      } catch (err) { 
        console.error("Search error", err); 
      }
    } else {
      setSearchResults([]);
    }
  };

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [postRes, userRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/achievements`),
        axios.get(`${API_BASE_URL}/api/company/me`, config) 
      ]);
      
      setAchievements(postRes.data.data || []);
      // Ensure we extract IDs from the following list for string comparison
      const following = userRes.data?.data?.user?.following || [];
      setFollowingList(following.map(f => typeof f === 'object' ? f._id.toString() : f.toString()));
    } catch (err) { 
      console.error("Error fetching network data", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(payload);
      } catch (e) { console.error("Token decoding failed", e); }
      fetchData();
    }
  }, [token]);

  // UPDATED: Optimized follow logic for immediate UI feedback
  const handleFollow = async (targetUserId) => {
    if (!targetUserId) return alert("User ID not found.");
    try {
      const res = await axios.put(`${API_BASE_URL}/api/company/follow/${targetUserId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        const targetIdStr = targetUserId.toString();
        if (res.data.isFollowing) {
          setFollowingList(prev => [...prev, targetIdStr]);
        } else {
          setFollowingList(prev => prev.filter(id => id !== targetIdStr));
        }
      }
    } catch (err) {
      console.error("Follow error:", err);
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
    } catch (err) { 
      alert("Error posting milestone. Ensure category is valid."); 
    }
  };

  return (
    <div className="network-content-wrapper">
      {/* Search Bar */}
      <div className="search-container" style={{ marginBottom: '20px', position: 'relative' }}>
        <input 
          type="text" 
          placeholder="Search industrial partners..." 
          className="search-input glass"
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: '100%', padding: '12px 20px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.2)' }}
        />
        {searchResults.length > 0 && (
          <div className="search-dropdown glass" style={{ position: 'absolute', top: '50px', width: '100%', zIndex: 1000, borderRadius: '12px', overflow: 'hidden' }}>
            {searchResults.map(profile => {
              const targetId = profile.user?._id || profile._id;
              return (
                <div key={profile._id} className="search-item" style={{ padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <span>{profile.name || profile.companyName || profile.user?.name}</span>
                  <button 
                    onClick={() => handleFollow(targetId)}
                    style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: '600', cursor: 'pointer' }}
                  >
                    {followingList.includes(targetId.toString()) ? "✓ Connected" : "+ Connect"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Post Trigger */}
      <div className="post-trigger-box glass">
        <div className="user-avatar-small">{currentUser?.name?.charAt(0) || "C"}</div>
        <button onClick={() => setShowPostModal(true)}>Share a corporate update or industrial milestone...</button>
      </div>

      {/* Main Feed */}
      <div className="main-feed">
        {loading ? (
          <div className="network-loader">Loading Industrial Feed...</div>
        ) : achievements.length === 0 ? (
          <div className="no-posts">No updates yet.</div>
        ) : achievements.map((post) => {
          const postUserId = post.trainer?.user?._id || post.trainer?.user || post.trainer?._id || post.authorId;
          const isMe = postUserId === currentUser?.id;

          return (
            <div key={post._id} className="pro-post-card glass">
              <div className="post-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="author-img-circle">{post.trainer?.name?.charAt(0) || post.companyName?.charAt(0) || "I"}</div>
                  <div className="author-details">
                    <strong style={{ display: 'block' }}>{post.trainer?.name || post.companyName || "Industrial Partner"}</strong>
                    <span className="post-meta-sub">{post.category} at {post.companyName || "Industrial Hub"}</span>
                  </div>
                </div>

                {!isMe && postUserId && (
                  <button 
                    onClick={() => handleFollow(postUserId)}
                    style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: '700', cursor: 'pointer' }}
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

      {/* Modal */}
      {showPostModal && (
        <div className="modern-modal-overlay">
          <div className="modern-modal glass">
            <div className="modal-head">
              <h3>Share Milestone</h3>
              <button onClick={() => setShowPostModal(false)}>&times;</button>
            </div>
            <form onSubmit={handlePostSubmit}>
              <div className="modal-body">
                <select className="modal-select" value={newPost.category} onChange={(e) => setNewPost({...newPost, category: e.target.value})}>
                  <option value="Project Completion">Project Launch</option>
                  <option value="Certification">Corporate Certification</option>
                  <option value="Workshop">Industrial Workshop</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Your Company Name" 
                  className="modal-input" 
                  value={newPost.companyName}
                  onChange={(e) => setNewPost({...newPost, companyName: e.target.value})} 
                />
                <textarea 
                  placeholder="Share details..." 
                  className="modal-textarea" 
                  value={newPost.description}
                  onChange={(e) => setNewPost({...newPost, description: e.target.value})} 
                  required 
                />
                {previewUrl && <div className="modal-preview"><img src={previewUrl} alt="Preview" /></div>}
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => fileInputRef.current.click()}>📷 Photo</button>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setSelectedFile(file); 
                    setPreviewUrl(URL.createObjectURL(file));
                  }
                }} />
                <button type="submit" className="post-submit-btn">Post</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyNetwork;