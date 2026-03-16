import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import AccountType from "./pages/auth/AccountType";
import TrainerRegister from "./pages/auth/TrainerRegister";
import CompanyRegister from "./pages/auth/CompanyRegister";
import Login from "./pages/auth/Login";
<<<<<<< HEAD

// Admin
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProjects from "./pages/admin/Projects";
import AdminReports from "./pages/admin/Reports";
import AdminUsers from "./pages/admin/Users";

// Company
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CompanyApplications from "./pages/company/Applications";
import CompanyPostProject from "./pages/company/PostProject";
import CompanyScheduleInterview from "./pages/company/ScheduleInterview";
import CompanyShortlisted from "./pages/company/Shortlisted";

// Trainer
import TrainerDashboard from "./pages/trainer/Dashboard";
import TrainerApplications from "./pages/trainer/Applications";
import TrainerProfile from "./pages/trainer/Profile";
import TrainerProjects from "./pages/trainer/Projects";
import TrainerResumeUpload from "./pages/trainer/ResumeUpload";

=======
import CompanyDashboard from "./pages/company/CompanyDashboard";
>>>>>>> e25889bd8e943885bb958141fbb1daf8bfc16429
function App() {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD

        {/* Public Routes */}
=======
>>>>>>> e25889bd8e943885bb958141fbb1daf8bfc16429
        <Route path="/" element={<LandingPage />} />
        <Route path="/select-account" element={<AccountType />} />
        <Route path="/register-trainer" element={<TrainerRegister />} />
        <Route path="/register-company" element={<CompanyRegister />} />
        <Route path="/login" element={<Login />} />

<<<<<<< HEAD
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/projects" element={<AdminProjects />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/users" element={<AdminUsers />} />

        {/* Company Routes */}
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/company/applications" element={<CompanyApplications />} />
        <Route path="/company/post-project" element={<CompanyPostProject />} />
        <Route path="/company/schedule-interview" element={<CompanyScheduleInterview />} />
        <Route path="/company/shortlisted" element={<CompanyShortlisted />} />

        {/* Trainer Routes */}
        <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
        <Route path="/trainer/applications" element={<TrainerApplications />} />
        <Route path="/trainer/profile" element={<TrainerProfile />} />
        <Route path="/trainer/projects" element={<TrainerProjects />} />
        <Route path="/trainer/resume-upload" element={<TrainerResumeUpload />} />

=======
        {/* ✅ ADD THIS ROUTE */}
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
>>>>>>> e25889bd8e943885bb958141fbb1daf8bfc16429
      </Routes>
    </Router>
  );
}

export default App;