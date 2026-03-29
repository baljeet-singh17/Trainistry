
import React, { useState } from "react";
import axios from "axios";
import "../../styles/companyDashboard.css";

const PostProjectForm = ({ companyId, onPost }) => {
  const [formData, setFormData] = useState({
    title: "",
    technology: "",
    location: "",
    startDate: "",
    durationDays: "",
    perDayPayment: "",
    paymentTerms: "",
    tfaProvided: false,
    tocProvided: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!companyId) {
      alert("Company ID not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/company/${companyId}/projects`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("Success: Training Requirement Posted!");

      setFormData({
        title: "",
        technology: "",
        location: "",
        startDate: "",
        durationDays: "",
        perDayPayment: "",
        paymentTerms: "",
        tfaProvided: false,
        tocProvided: false,
      });

      if (onPost) onPost();
    } catch (err) {
      console.error("Error posting project:", err.response || err);
      alert(err.response?.data?.message || "Failed to post requirement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper glass">
      <div className="form-header-section">
        <h2 className="form-title">Post New Training Requirement</h2>
        <p className="form-subtitle">Fill in the details to find the best trainers for your project.</p>
      </div>

      <form onSubmit={handleSubmit} className="project-form">
        {/* Row 1: Title & Technology */}
        <div className="form-row">
          <div className="form-group">
            <label>Project Title</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g. MERN Stack Corporate Training"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Technology Stack</label>
            <input
              type="text"
              name="technology"
              className="form-input"
              placeholder="e.g. React, Node.js, AWS"
              value={formData.technology}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Row 2: Location & Start Date */}
        <div className="form-row">
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              className="form-input"
              placeholder="e.g. Remote / Mumbai"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              className="form-input"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Row 3: Duration & Budget */}
        <div className="form-row">
          <div className="form-group">
            <label>Duration (Days)</label>
            <input
              type="number"
              name="durationDays"
              className="form-input"
              placeholder="Total days"
              value={formData.durationDays}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Budget (Per Day)</label>
            <input
              type="number"
              name="perDayPayment"
              className="form-input"
              placeholder="INR"
              value={formData.perDayPayment}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Row 4: Payment Terms */}
        <div className="form-group">
          <label>Payment Terms</label>
          <input
            type="text"
            name="paymentTerms"
            className="form-input"
            placeholder="e.g. 50% Advance, 50% Post Completion"
            value={formData.paymentTerms}
            onChange={handleChange}
            required
          />
        </div>

        {/* Inclusions Checkboxes */}
        <div className="form-group">
          <label>Provide Inclusions</label>
          <div className="checkbox-group">
            <label className="custom-checkbox">
              <input
                type="checkbox"
                name="tfaProvided"
                onChange={handleChange}
                checked={formData.tfaProvided}
              />
              <span className="checkmark"></span>
              TFA (Travel/Food/Accom.)
            </label>
            <label className="custom-checkbox">
              <input
                type="checkbox"
                name="tocProvided"
                onChange={handleChange}
                checked={formData.tocProvided}
              />
              <span className="checkmark"></span>
              TOC (Detailed Curriculum)
            </label>
          </div>
        </div>

        <button type="submit" className="btn-primary full-width" disabled={loading}>
          {loading ? "Posting..." : "Post Training Requirement"}
        </button>
      </form>
    </div>
  );
};

export default PostProjectForm;