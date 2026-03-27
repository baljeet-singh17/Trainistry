import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import AccountType from "./pages/auth/AccountType";
import TrainerRegister from "./pages/auth/TrainerRegister";
import CompanyRegister from "./pages/auth/CompanyRegister";
import Login from "./pages/auth/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/select-account" element={<AccountType />} />
        <Route path="/register-trainer" element={<TrainerRegister />} />
        <Route path="/register-company" element={<CompanyRegister />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;