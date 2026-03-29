
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../../styles/auth.css";
import { useParams, useNavigate } from "react-router-dom";

function ApplyForProject() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [project, setProject] = useState(null);
  const [proposalMessage, setProposalMessage] = useState("");
  const [expectedRate, setExpectedRate] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Wrapped in useCallback or kept simple to avoid "size changed" hook errors
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProject = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/projects/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProject(res.data.data || res.data);
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    };

    fetchProject();
  }, [projectId, token, navigate]); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!proposalMessage || !resumeFile) {
      alert("Please provide a proposal message and upload your resume.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      // Ensure "resume" matches your backend upload.single('resume')
      formData.append("resume", resumeFile);
      formData.append("proposalMessage", proposalMessage);
      formData.append("expectedRate", expectedRate);

      await axios.post(
        `http://localhost:5000/api/trainer/projects/${projectId}/apply`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Application submitted successfully!");
      navigate("/trainer/applications");
    } catch (err) {
      // Detailed logging to debug the 500 error
      console.error("Full Error Object:", err);
      console.error("Server Response Data:", err.response?.data);
      
      const errorMsg = err.response?.data?.message || "Server Error (500). Check backend terminal.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!project) return <div className="loader">Loading project details...</div>;

  return (
    <div className="auth-page">
      <div className="form-card glass">
        <h2>Apply for Training</h2>
        <h4 style={{ color: '#2563eb', marginBottom: '20px' }}>{project.title}</h4>

        <form onSubmit={handleSubmit}>
          <label>Proposal Message</label>
          <textarea
            rows="5"
            className="input"
            placeholder="Why are you the best fit for this project?"
            value={proposalMessage}
            onChange={(e) => setProposalMessage(e.target.value)}
            required
          />

          <label>Expected Rate (Per Day)</label>
          <input
            type="number"
            className="input"
            placeholder={project.perDayPayment || "0"}
            value={expectedRate}
            onChange={(e) => setExpectedRate(e.target.value)}
          />

          <label>Resume (PDF only)</label>
          <input
            type="file"
            accept=".pdf"
            className="input"
            onChange={(e) => setResumeFile(e.target.files[0])}
            required
          />

          <button type="submit" className="btn-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>
          <button type="button" className="sidebar-btn" onClick={() => navigate(-1)} style={{ width: '100%', marginTop: '10px' }}>
            Back
          </button>
        </form>
      </div>
    </div>
  );
}

export default ApplyForProject;