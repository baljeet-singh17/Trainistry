import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">

      {/* ===================== NAVBAR ===================== */}
      <nav className="navbar">
        <div className="logo">Trainistry</div>
        <div className="nav-actions">
          <button className="login-btn">
            Login
          </button>

          <button
            className="primary-btn"
            onClick={() => navigate("/select-account")}
          >
            Get Started
          </button>
        </div>
      </nav>


      {/* ===================== HERO SECTION ===================== */}
      <section className="hero">
        <div className="hero-left">
          <h1>
            Where <span className="gradient-purple">Trainers</span> meet{" "}
            <span className="gradient-cyan">Industry</span>
          </h1>

          <p>
            A professional platform connecting verified trainers with companies
            looking to upskill their workforce.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn large"
              onClick={() => navigate("/register-trainer")}
            >
              Join as a Trainer
            </button>

            <button
              className="secondary-btn large"
              onClick={() => navigate("/register-company")}
            >
              Find Trainers
            </button>
          </div>
        </div>

        <div className="hero-right">
          <img
            src="https://illustrations.popsy.co/purple/man-working-on-laptop.svg"
            alt="Hero Illustration"
          />
        </div>
      </section>


      {/* ===================== FEATURES SECTION ===================== */}
      <section className="features">
        <div className="section-header">
          <h2>Why Choose Trainistry?</h2>
          <p>Everything you need to connect, grow and scale.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="icon purple-bg">✓</div>
            <h3>Verified Trainers</h3>
            <p>All trainers are screened and validated.</p>
          </div>

          <div className="feature-card">
            <div className="icon teal-bg">🚀</div>
            <h3>Fast Hiring</h3>
            <p>Connect with trainers instantly and efficiently.</p>
          </div>

          <div className="feature-card">
            <div className="icon pink-bg">📊</div>
            <h3>Growth Analytics</h3>
            <p>Track training performance and impact.</p>
          </div>

          <div className="feature-card">
            <div className="icon purple-bg">🤝</div>
            <h3>Industry Network</h3>
            <p>Access a wide network of companies.</p>
          </div>

          <div className="feature-card">
            <div className="icon teal-bg">💼</div>
            <h3>Project Matching</h3>
            <p>AI-driven matching between trainers & companies.</p>
          </div>

          <div className="feature-card">
            <div className="icon pink-bg">🔒</div>
            <h3>Secure Platform</h3>
            <p>Protected payments and verified contracts.</p>
          </div>
        </div>
      </section>


      {/* ===================== STATS SECTION ===================== */}
      <section className="stats">
        <div className="stat-item">
          <h3>5,000+</h3>
          <p>Verified Trainers</p>
        </div>

        <div className="stat-item">
          <h3>1,200+</h3>
          <p>Companies</p>
        </div>

        <div className="stat-item">
          <h3>10,000+</h3>
          <p>Projects Completed</p>
        </div>

        <div className="stat-item">
          <h3>98%</h3>
          <p>Satisfaction Rate</p>
        </div>
      </section>


      {/* ===================== FINAL CTA ===================== */}
      <section className="final-cta">
        <h2>Ready to Transform Learning?</h2>
        <p>Create your free account today and start connecting.</p>

        <button
          className="primary-btn large"
          onClick={() => navigate("/select-account")}
        >
          Create Free Account
        </button>
      </section>


      {/* ===================== FOOTER ===================== */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h3>Trainistry</h3>
            <p>Connecting Trainers with Industry.</p>
          </div>

          <div>
            <h4>Platform</h4>
            <p>Find Trainers</p>
            <p>Post Projects</p>
            <p>Analytics</p>
          </div>

          <div>
            <h4>Company</h4>
            <p>About Us</p>
            <p>Careers</p>
            <p>Contact</p>
          </div>

          <div>
            <h4>Legal</h4>
            <p>Privacy Policy</p>
            <p>Terms of Service</p>
          </div>
        </div>

        <div className="copyright">
          © 2026 Trainistry. All rights reserved.
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;