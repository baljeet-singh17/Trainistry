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

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password
      });

      // Store token and user data
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data));
        
        // Redirect based on role
        if (res.data.role === "company") {
          navigate("/company-dashboard");
        } else if (res.data.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/trainer-dashboard");
        }
      }

    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(message);
      alert(message);
    }
  };

  return (
    <div className="auth-page">
      <div className="form-card">

        <h2>Welcome Back</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
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

          <button type="submit" className="btn-full">
            Sign In
          </button>
        </form>

        <div className="demo-box">
          <h4>Demo Accounts</h4>
          <p>Trainer: trainer@test.com</p>
          <p>Company: company@test.com</p>
          <p>Admin: admin@test.com</p>
        </div>

        <p className="auth-footer">
          Don't have an account?{" "}
          <span onClick={() => navigate("/select-account")}>
            Sign up
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;

