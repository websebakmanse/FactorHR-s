// ============================================================
// app.js — Express application setup
// Here we configure all middleware and routes
// ============================================================

const express = require("express");
const cors = require("cors");           // Allows frontend to talk to backend
const cookieParser = require("cookie-parser"); // Reads cookies from requests
const errorHandler = require("./middleware/errorMiddleware");

// Import auth routes (login, refresh, logout)
const authRoutes = require("./routes/authRoutes");

// Create the Express app
const app = express();

// -------------------------------------------------------
// MIDDLEWARE SETUP
// Middleware runs on every request before it hits the route
// -------------------------------------------------------

// Allow requests from our React frontend
// credentials: true → allows cookies to be sent with requests
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Parse incoming JSON request bodies (e.g. { email, password })
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: false }));

// Parse cookies from request headers (needed for refresh token)
app.use(cookieParser());

// -------------------------------------------------------
// ROUTES
// Each route group handles a specific feature
// -------------------------------------------------------

// All auth routes: /api/auth/login, /api/auth/refresh, /api/auth/logout
app.use("/api/auth", authRoutes);

// Health check — useful to verify server is running
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// -------------------------------------------------------
// ERROR HANDLER
// This catches any errors thrown in routes/controllers
// Must be placed AFTER all routes
// -------------------------------------------------------
app.use(errorHandler);

// Export app so server.js can use it
module.exports = app;
