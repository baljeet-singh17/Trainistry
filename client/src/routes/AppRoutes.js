import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import AccountType from "../pages/auth/AccountType";
import CompanyRegister from "../pages/auth/CompanyRegister";
import TrainerRegister from "../pages/auth/TrainerRegister";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/select-account" element={<AccountType />} />
        <Route path="/register-company" element={<CompanyRegister />} />
        <Route path="/register-trainer" element={<TrainerRegister />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;