// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import LandingPage from "../pages/LandingPage";
// import AccountType from "../pages/auth/AccountType";
// import CompanyRegister from "../pages/auth/CompanyRegister";
// import TrainerRegister from "../pages/auth/TrainerRegister";

// function AppRoutes() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/select-account" element={<AccountType />} />
//         <Route path="/register-company" element={<CompanyRegister />} />
//         <Route path="/register-trainer" element={<TrainerRegister />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default AppRoutes;


import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import AccountType from "../pages/auth/AccountType";
import CompanyRegister from "../pages/auth/CompanyRegister";
import TrainerRegister from "../pages/auth/TrainerRegister";

// Trainer Pages
import TrainerDashboard from "../pages/trainer/TrainerDashboard";
import TrainerApplications from "../pages/trainer/Applications";
import ProjectDetails from "../pages/trainer/ProjectDetails"; // new page

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public / Auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/select-account" element={<AccountType />} />
        <Route path="/register-company" element={<CompanyRegister />} />
        <Route path="/register-trainer" element={<TrainerRegister />} />

        {/* Trainer Routes */}
        <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
        <Route path="/trainer/applications" element={<TrainerApplications />} />
        <Route path="/trainer/project/:projectId" element={<ProjectDetails />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;