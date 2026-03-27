import DashboardLayout from "../../layouts/DashboardLayout";

const CompanyDashboard = () => {
  return (
    <DashboardLayout>
      <div className="profile-card">
        <div className="profile-left">
          <div className="avatar company">TC</div>
          <div>
            <h2>Tech Corporation</h2>
            <p>Technology & Software Development Company</p>
            <p>San Francisco, CA • 500-1000 employees</p>
          </div>
        </div>

        <button className="btn-primary">Edit Profile</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Sessions</h4>
          <h2>89</h2>
          <p>+8 this month</p>
        </div>

        <div className="stat-card">
          <h4>Active Trainers</h4>
          <h2>12</h2>
          <p>In network</p>
        </div>

        <div className="stat-card">
          <h4>Total Investment</h4>
          <h2>$142,500</h2>
          <p>Last 12 months</p>
        </div>

        <div className="stat-card">
          <h4>Avg Satisfaction</h4>
          <h2>94%</h2>
          <p>Excellent</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanyDashboard;