import React, { useState } from "react";

import PostProjectForm from "../../components/company/PostProjectForm";
import CompanyProjects from "../../components/company/CompanyProjects";
import NotificationPanel from "../../components/company/NotificationPanel";

import "../../styles/companyDashboard.css";

function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const companyId = localStorage.getItem("companyId");

  return (
    <div className="company-dashboard">
      <div className="sidebar">
        <h2>Company Panel</h2>

        <button onClick={() => setActiveTab("projects")}>
          My Projects
        </button>

        <button onClick={() => setActiveTab("post")}>
          Post Project
        </button>

        <button
  className={activeTab === "notifications" ? "active" : ""}
  onClick={() => setActiveTab("notifications")}
>
  Notifications
</button>
      </div>

      <div className="main-content">
        {activeTab === "projects" && (
          <CompanyProjects companyId={companyId} />
        )}

        {activeTab === "post" && (
          <PostProjectForm companyId={companyId} />
        )}

        {activeTab === "notifications" && (
          <NotificationPanel companyId={companyId} />
        )}
      </div>
    </div>
  );
}

export default CompanyDashboard;