import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";

function CompanyRegister() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="form-card">

        <div className="summary-bar cyan">
          🏢 Company Account
          <span onClick={() => navigate("/select-account")}>Change</span>
        </div>

        <input placeholder="Contact Name" className="input" />
        <input type="password" placeholder="Password" className="input" />
        <input placeholder="Company Name" className="input" />

        <button className="btn-cyan">Create Account</button>

      </div>
    </div>
  );
}

export default CompanyRegister;