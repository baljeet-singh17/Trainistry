import DashboardLayout from "../../layouts/DashboardLayout";
import "../../styles/dashboard.css";

const TrainerDashboard = () => {
  return (
    <DashboardLayout>
      <div className="profile-card">
        <div className="profile-left">
          <div className="avatar">JD</div>
          <div>
            <h2>John Doe</h2>
            <p>Leadership & Professional Development Expert</p>
            <div className="tags">
              <span>Leadership</span>
              <span>Communication</span>
              <span>Team Building</span>
            </div>
          </div>
        </div>

        <button className="btn-primary">Edit Profile</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Sessions</h4>
          <h2>147</h2>
          <p>+12 this month</p>
        </div>

        <div className="stat-card">
          <h4>Total Earnings</h4>
          <h2>$58,400</h2>
          <p>Lifetime</p>
        </div>

        <div className="stat-card">
          <h4>Average Rating</h4>
          <h2>4.8 ⭐</h2>
          <p>From 89 reviews</p>
        </div>

        <div className="stat-card">
          <h4>Avg Response Time</h4>
          <h2>2.3 hrs</h2>
          <p>Excellent</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TrainerDashboard;