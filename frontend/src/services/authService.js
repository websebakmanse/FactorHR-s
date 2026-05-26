// ============================================================
// services/authService.js — Auth API Calls
// ============================================================
// These functions call the backend auth endpoints
// We keep API calls in a separate file (not in components)
// so they're easy to find and reuse
// ============================================================

import axiosInstance from "./axiosInstance";

// POST /api/auth/login
// Sends email and password, gets back accessToken + user info
export const loginAPI = (email, password) =>
  axiosInstance.post("/auth/login", { email, password });

// POST /api/auth/refresh
// Sends the refresh token cookie (automatically), gets new accessToken
export const refreshAPI = () =>
  axiosInstance.post("/auth/refresh");

// POST /api/auth/logout
// Tells backend to delete the refresh token from database
export const logoutAPI = () =>
  axiosInstance.post("/auth/logout");
