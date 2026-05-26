// ============================================================
// routes/ProtectedRoute.jsx — Route Guard Component
// ============================================================
// Wraps routes that require authentication
// Checks if user is logged in before showing the page
//
// Usage in App.jsx:
//   <ProtectedRoute allowedRoles={["admin"]}>
//     <HrDashBoard />
//   </ProtectedRoute>
//
// What it does:
// 1. While loading → show spinner (don't redirect yet)
// 2. Not logged in → redirect to /login
// 3. Wrong role → redirect to correct dashboard
// 4. Correct role → show the page
// ============================================================

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  // Case 1: Still checking if user is logged in (page refresh)
  // Show a spinner instead of redirecting — avoids flash of login page
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Case 2: Not logged in → go to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Case 3: Logged in but wrong role
  // e.g. employee trying to access /hr → redirect to /employee
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "admin" ? "/hr" : "/employee"} replace />;
  }

  // Case 4: All checks passed → show the protected page
  return children;
};

export default ProtectedRoute;
