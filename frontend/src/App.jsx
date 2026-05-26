import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./components/auth/Login";
import HrDashBoard from "./components/hr/HrDashBoard";
import EmployeDashboard from "./components/employee/EmployeDashboard";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* HR Admin only */}
          <Route
            path="/hr"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <HrDashBoard />
              </ProtectedRoute>
            }
          />

          {/* Employee only */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeDashboard />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
