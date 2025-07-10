import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import VerifyEmail from "./components/VerifyEmail";

function App() {
  // This component now acts as the main router for your application.
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes that anyone can access */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* This is a placeholder for a protected route. We'll secure it later. */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Redirect any other path to the login page by default */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
