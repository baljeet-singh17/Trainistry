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
    companyName: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent refresh

    try {
      const res = await axios.post("/api/company", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        industry: "General",
        location: "India",
        description: formData.companyName
      });

      localStorage.setItem("companyId", res.data.data._id);
      navigate("/company-dashboard");

    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="form-card">

        <div className="summary-bar">
          🏢 Company Account
          <span onClick={() => navigate("/select-account")}>
            Change
          </span>
        </div>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Contact Name"
            className="input"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            className="input"
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn-full">
            Create Account
          </button>

        </form>

      </div>
    </div>
  );
}

export default CompanyRegister;