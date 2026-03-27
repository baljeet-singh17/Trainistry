import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";

function TrainerRegister() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="form-card">

        <div className="summary-bar purple">
          👨‍🏫 Trainer Account
          <span onClick={() => navigate("/select-account")}>Change</span>
        </div>

        <input placeholder="Full Name" className="input" />
        <input type="password" placeholder="Password" className="input" />
        <input placeholder="Area of Expertise" className="input" />

        <button className="btn-purple">Create Account</button>

      </div>
    </div>
  );
}

export default TrainerRegister;