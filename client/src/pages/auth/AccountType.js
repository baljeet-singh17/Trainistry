import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";

function AccountType() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">

      <div className="auth-logo">Trainistry</div>

      <div className="auth-card">
        <h2>Create Your Account</h2>
        <p>Choose your account type to continue</p>

        <div className="account-options">

          <div
            className="account-card trainer"
            onClick={() => navigate("/register-trainer")}
          >
            <div className="icon trainer-icon">👨‍🏫</div>
            <h3>Trainer</h3>
          </div>

          <div
            className="account-card company"
            onClick={() => navigate("/register-company")}
          >
            <div className="icon company-icon">🏢</div>
            <h3>Company</h3>
          </div>

        </div>

        <p className="auth-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Sign in</span>
        </p>
      </div>
    </div>
  );
}

export default AccountType;