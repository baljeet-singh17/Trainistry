import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/companyDashboard.css";

function CompanyProjects({ companyId }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await axios.get(`/api/company/${companyId}/projects`);
      setProjects(res.data.data);
    };
    fetchProjects();
  }, [companyId]);

  return (
    <div>
      <h2>My Projects</h2>

      {projects.map((project) => (
        <div key={project._id} className="project-card">
          <h3>{project.technology}</h3>
          <p>Location: {project.location}</p>

         
          <span
            className={`status-badge status-${project.status?.toLowerCase()}`}
          >
            {project.status}
          </span>
        </div>
      ))}
    </div>
  );
}

export default CompanyProjects;