import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import CropStatus from "./pages/farmstatus/CropStatus";
import LoginPage from "./auth/Login";
import Dashboard from "./pages/home/page";

function App() {
  const [] = useState(0);

  return (
    <Router>
      <Routes>
        {/* Redirect the root path to the login page */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* CropStatus page */}
        <Route path="/crop-status" element={<CropStatus />} />
        {/* Dashboard page */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
