import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.get("/api/company");

      const foundCompany = res.data.find(
        (c) => c.email === formData.email
      );

      if (foundCompany) {
        localStorage.setItem("companyId", foundCompany._id);
        navigate("/company-dashboard");
      } else {
        alert("User not found");
      }

    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="form-card">

        <h2>Welcome Back</h2>

        <input
          name="email"
          placeholder="Email Address"
          className="input"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input"
          onChange={handleChange}
        />

        <button className="btn-full" onClick={handleSubmit}>
          Sign In
        </button>

        <div className="demo-box">
          <h4>Demo Accounts</h4>
          <p>Trainer: trainer@test.com</p>
          <p>Company: company@test.com</p>
          <p>Admin: admin@test.com</p>
        </div>

        <p className="auth-footer">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/select-account")}>
            Sign up
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;