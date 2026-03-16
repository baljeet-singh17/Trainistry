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
    expertise: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
<<<<<<< HEAD
    e.preventDefault();

    try {
      // Use the auth register endpoint with trainer role
      const res = await axios.post("/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "trainer",
        expertise: formData.expertise
      });

      // Store token and user data
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/trainer-dashboard");
      }

    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Registration failed";
      alert(message);
=======
    e.preventDefault(); // prevent page refresh

    try {
      const res = await axios.post("/api/trainer", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        expertise: formData.expertise
      });

      localStorage.setItem("trainerId", res.data._id);
      navigate("/trainer-dashboard");

    } catch (error) {
      console.error(error);
      alert("Registration failed");
>>>>>>> e25889bd8e943885bb958141fbb1daf8bfc16429
    }
  };

  return (
    <div className="auth-page">
      <div className="form-card">

        <div className="summary-bar">
          👨‍🏫 Trainer Account
          <span onClick={() => navigate("/select-account")}>
            Change
          </span>
        </div>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
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
            name="expertise"
            placeholder="Area of Expertise"
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

<<<<<<< HEAD
export default TrainerRegister;

=======
export default TrainerRegister;
>>>>>>> e25889bd8e943885bb958141fbb1daf8bfc16429
