import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
<<<<<<< HEAD
import Login from "../pages/auth/Login";
=======
>>>>>>> e25889bd8e943885bb958141fbb1daf8bfc16429
import AccountType from "../pages/auth/AccountType";
import CompanyRegister from "../pages/auth/CompanyRegister";
import TrainerRegister from "../pages/auth/TrainerRegister";

<<<<<<< HEAD
// Admin Pages
import AdminDashboard from "../pages/admin/Dashboard";
import AdminProjects from "../pages/admin/Projects";
import AdminReports from "../pages/admin/Reports";
import AdminUsers from "../pages/admin/Users";

// Company Pages
import CompanyDashboard from "../pages/company/Dashboard";
import CompanyApplications from "../pages/company/Applications";
import CompanyPostProject from "../pages/company/PostProject";
import CompanyScheduleInterview from "../pages/company/ScheduleInterview";
import CompanyShortlisted from "../pages/company/Shortlisted";

// Trainer Pages
import TrainerDashboard from "../pages/trainer/Dashboard";
import TrainerApplications from "../pages/trainer/Applications";
import TrainerProfile from "../pages/trainer/Profile";
import TrainerProjects from "../pages/trainer/Projects";
import TrainerResumeUpload from "../pages/trainer/ResumeUpload";

=======
>>>>>>> e25889bd8e943885bb958141fbb1daf8bfc16429
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< HEAD
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/select-account" element={<AccountType />} />
        <Route path="/register-company" element={<CompanyRegister />} />
        <Route path="/register-trainer" element={<TrainerRegister />} />
        
        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-projects" element={<AdminProjects />} />
        <Route path="/admin-reports" element={<AdminReports />} />
        <Route path="/admin-users" element={<AdminUsers />} />
        
        {/* Company Routes */}
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/company-applications" element={<CompanyApplications />} />
        <Route path="/company-post-project" element={<CompanyPostProject />} />
        <Route path="/company-schedule-interview" element={<CompanyScheduleInterview />} />
        <Route path="/company-shortlisted" element={<CompanyShortlisted />} />
        
        {/* Trainer Routes */}
        <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
        <Route path="/trainer-applications" element={<TrainerApplications />} />
        <Route path="/trainer-profile" element={<TrainerProfile />} />
        <Route path="/trainer-projects" element={<TrainerProjects />} />
        <Route path="/trainer-resume-upload" element={<TrainerResumeUpload />} />
=======
        <Route path="/" element={<LandingPage />} />
        <Route path="/select-account" element={<AccountType />} />
        <Route path="/register-company" element={<CompanyRegister />} />
        <Route path="/register-trainer" element={<TrainerRegister />} />
>>>>>>> e25889bd8e943885bb958141fbb1daf8bfc16429
      </Routes>
    </BrowserRouter>
  );
}

<<<<<<< HEAD
export default AppRoutes;
=======
export default AppRoutes;
>>>>>>> e25889bd8e943885bb958141fbb1daf8bfc16429
