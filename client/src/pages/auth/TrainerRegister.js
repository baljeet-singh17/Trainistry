// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "../../styles/auth.css";

// function TrainerRegister() {
//   const navigate = useNavigate();

//   return (
//     <div className="auth-page">
//       <div className="form-card">

//         <div className="summary-bar purple">
//           👨‍🏫 Trainer Account
//           <span onClick={() => navigate("/select-account")}>Change</span>
//         </div>

//         <input placeholder="Full Name" className="input" />
//         <input type="password" placeholder="Password" className="input" />
//         <input placeholder="Area of Expertise" className="input" />

//         <button className="btn-purple">Create Account</button>

//       </div>
//     </div>
//   );
// }

// export default TrainerRegister;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/auth.css";

function TrainerRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    expertise: ""
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
        ...formData,
        role: "trainer"
      });

      alert("Registration successful!");
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
          👨‍🏫 Trainer Account 
          <span onClick={() => navigate("/select-account")}>Change</span>
        </div>

        <h2>Create Trainer Account</h2>
        <p>Showcase your skills and start getting training projects</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
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
            name="expertise"
            placeholder="Area of Expertise"
            className="input"
            value={formData.expertise}
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

export default TrainerRegister;