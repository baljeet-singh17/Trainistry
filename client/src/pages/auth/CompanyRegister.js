import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/auth.css";

function CompanyRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    companyName: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: "company",
        industry: "General",
        location: "India",
        description: formData.companyName
      });

      alert("Company registration successful!");
      navigate("/login");

    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="form-card">

        <div className="summary-bar">
          🏢 Company Account 
          <span onClick={() => navigate("/select-account")}>Change</span>
        </div>

        <h2>Create Company Account</h2>
        <p>Register your organization and start posting training projects</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Contact Name"
            className="input"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className="input"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            className="input"
            value={formData.companyName}
            onChange={handleChange}
            required
          />

          <button 
            type="submit" 
            className="btn-full" 
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default CompanyRegister;