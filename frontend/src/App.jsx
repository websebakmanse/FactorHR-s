// ============================================================
// App.jsx — Root Component and Route Configuration
// ============================================================
// This is the main entry point of the React app
// It sets up:
// 1. BrowserRouter — enables URL-based navigation
// 2. AuthProvider — wraps everything so all components can
//    access user/login/logout via useAuth()
// 3. Routes — maps URLs to components
//
// Route structure:
//   /login    → Login page (public)
//   /hr       → HR Dashboard (admin only)
//   /employee → Employee Dashboard (employee only)
//   /         → Redirects to /login
//   *         → Any unknown URL → redirects to /login
// ============================================================

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./components/auth/Login";
import HrDashBoard from "./components/hr/HrDashBoard";
import EmployeDashboard from "./components/employee/EmployeDashboard";

const App = () => {
  return (
    // BrowserRouter enables React Router (URL navigation)
    <BrowserRouter>
      {/* AuthProvider must wrap Routes so useAuth() works everywhere */}
      <AuthProvider>
        <Routes>

          {/* Public route — anyone can access */}
          <Route path="/login" element={<Login />} />

          {/* Protected route — only admin (HR) can access */}
          <Route
            path="/hr"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <HrDashBoard />
              </ProtectedRoute>
            }
          />

          {/* Protected route — only employee can access */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeDashboard />
              </ProtectedRoute>
            }
          />

          {/* Default: redirect root URL to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Catch-all: any unknown URL goes to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
