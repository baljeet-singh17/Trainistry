// import React from "react";
// import axios from "axios";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import LandingPage from "./pages/LandingPage";
// import AccountType from "./pages/auth/AccountType";
// import TrainerRegister from "./pages/auth/TrainerRegister";
// import CompanyRegister from "./pages/auth/CompanyRegister";
// import Login from "./pages/auth/Login";
// import CompanyDashboard from "./pages/company/CompanyDashboard";
// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/select-account" element={<AccountType />} />
//         <Route path="/register-trainer" element={<TrainerRegister />} />
//         <Route path="/register-company" element={<CompanyRegister />} />
//         <Route path="/login" element={<Login />} />

//         {/* ✅ ADD THIS ROUTE */}
//         <Route path="/company-dashboard" element={<CompanyDashboard />} />
//       </Routes>
//     </Router>
//   );
// }
// // ✅ Set default Authorization header if token exists on app load
// const token = localStorage.getItem("token");
// if (token) {
//   axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// }

// export default App;

// import React from "react";
// import axios from "axios";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import LandingPage from "./pages/LandingPage";
// import AccountType from "./pages/auth/AccountType";
// import TrainerRegister from "./pages/auth/TrainerRegister";
// import CompanyRegister from "./pages/auth/CompanyRegister";
// import Login from "./pages/auth/Login";
// import CompanyDashboard from "./pages/company/CompanyDashboard";
// import TrainerDashboard from "./pages/trainer/TrainerDashboard"; 
// import TrainerApplications from "./pages/trainer/TrainerApplications";
// import ApplyForProject from "./pages/trainer/ApplyForProject";
// import ProjectApplications from "./pages/company/ProjectApplications";
// import TrainerNotifications from "./pages/trainer/TrainerNotifications";
// import ProjectDetails from "./pages/trainer/ProjectDetails";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/select-account" element={<AccountType />} />
//         <Route path="/register-trainer" element={<TrainerRegister />} />
//         <Route path="/register-company" element={<CompanyRegister />} />
//         <Route path="/login" element={<Login />} />

//         {/* ✅ Company dashboard */}
//         <Route path="/company-dashboard" element={<CompanyDashboard />} />

//         {/* ✅ Trainer dashboard */}
//         <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
//         <Route path="/trainer/applications" element={<TrainerApplications />} />
//         <Route path="/trainer/apply/:projectId" element={<ApplyForProject />} />
//         <Route path="/trainer/notifications" element={<TrainerNotifications />} />
//         <Route
//   path="/company/project/:projectId/applications"
//   element={<ProjectApplications />}
// />
// <Route path="/trainer/project/:projectId" element={<ProjectDetails />} />
//       </Routes>
//     </Router>
//   );
// }

// // ✅ Set default Authorization header if token exists on app load
// const token = localStorage.getItem("token");
// if (token) {
//   axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// }

// export default App;

import React from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import AccountType from "./pages/auth/AccountType";
import TrainerRegister from "./pages/auth/TrainerRegister";
import CompanyRegister from "./pages/auth/CompanyRegister";
import Login from "./pages/auth/Login";

// Company Imports
import CompanyDashboard from "./pages/company/CompanyDashboard";
import ProjectApplications from "./pages/company/ProjectApplications";

// Trainer Imports
import TrainerDashboard from "./pages/trainer/TrainerDashboard"; 
import TrainerApplications from "./pages/trainer/TrainerApplications";
import ApplyForProject from "./pages/trainer/ApplyForProject";
import TrainerNotifications from "./pages/trainer/TrainerNotifications";
import ProjectDetails from "./pages/trainer/ProjectDetails";
import Profile from "./pages/trainer/Profile"; 
import Network from "./pages/trainer/Network";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/select-account" element={<AccountType />} />
        <Route path="/register-trainer" element={<TrainerRegister />} />
        <Route path="/register-company" element={<CompanyRegister />} />
        <Route path="/login" element={<Login />} />

        {/* Company Routes */}
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/company/project/:projectId/applications" element={<ProjectApplications />} />

        {/* Trainer Routes */}
        <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
        <Route path="/trainer/applications" element={<TrainerApplications />} />
        <Route path="/trainer/apply/:projectId" element={<ApplyForProject />} />
        <Route path="/trainer/notifications" element={<TrainerNotifications />} />
        <Route path="/trainer/project/:projectId" element={<ProjectDetails />} />
        <Route path="/trainer/profile" element={<Profile />} /> {/* ✅ ADDED PROFILE ROUTE */}
        <Route path="/trainer/network" element={<Network />} />
      </Routes>
    </Router>
  );
}

// ✅ Set default Authorization header if token exists on app load
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default App;