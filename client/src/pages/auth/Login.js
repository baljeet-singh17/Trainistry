import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="form-card">

        <h2>Welcome Back</h2>

        <input placeholder="Email Address" className="input" />
        <input type="password" placeholder="Password" className="input" />

        <button className="btn-purple">Sign In</button>

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