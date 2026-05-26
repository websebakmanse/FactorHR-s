// ============================================================
// routes/authRoutes.js — Authentication Routes
// ============================================================
// Routes define the URL endpoints and which controller
// function handles each one
//
// Base path: /api/auth (set in app.js)
// Full paths:
//   POST /api/auth/login   → login()
//   POST /api/auth/refresh → refresh()
//   POST /api/auth/logout  → logout()
// ============================================================

const express = require("express");
const router = express.Router(); // Create a mini Express app for routes

// Import controller functions
const { login, refresh, logout } = require("../controllers/authController");

// POST /api/auth/login — User submits email + password
router.post("/login", login);

// POST /api/auth/refresh — Frontend silently gets a new access token
router.post("/refresh", refresh);

// POST /api/auth/logout — User clicks logout button
router.post("/logout", logout);

module.exports = router;
