import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/TrainerDashboard.css";
import { NavLink, useNavigate } from "react-router-dom";

function AvailableProjects() {

  const [projects, setProjects] = useState([]);

  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/trainer/projects",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProjects(res.data.data || []);

    } catch (err) {

      console.error("Error fetching projects:", err);

    }

  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleApplyClick = (projectId) => {

    // Navigate to application form page
    navigate(`/trainer/apply/${projectId}`);

  };

  return (

    <div className="trainer-dashboard">

      {/* Sidebar */}

      <div className="sidebar">

        <h2 className="logo">Trainistry</h2>

        <NavLink
          to="/trainer-dashboard"
          className="sidebar-btn active"
        >
          Available Projects
        </NavLink>

        <NavLink
          to="/trainer/applications"
          className="sidebar-btn"
        >
          My Applications
        </NavLink>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>


      {/* Main Content */}

      <div className="main-content">

        <h1>Available Projects</h1>

        <div className="projects-container">

          {projects.map((project) => {

            const budget =
              project.perDayPayment && project.durationDays
                ? project.perDayPayment * project.durationDays
                : "N/A";

            return (

              <div
                key={project._id}
                className="project-card"
              >

                <h3>{project.title}</h3>

                <p>
                  <b>Technology:</b> {project.technology || "N/A"}
                </p>

                <p>
                  <b>Budget:</b> ₹{budget}
                </p>

                <p>
                  <b>Duration:</b>{" "}
                  {project.durationDays
                    ? project.durationDays + " days"
                    : "N/A"}
                </p>

                <p>
                  <b>Company:</b>{" "}
                  {project.company?.name || "N/A"}
                </p>

                <button
                  className="apply-btn"
                  onClick={() => handleApplyClick(project._id)}
                >
                  Apply
                </button>

              </div>

            );

          })}

        </div>

      </div>

    </div>

  );

}

export default AvailableProjects;