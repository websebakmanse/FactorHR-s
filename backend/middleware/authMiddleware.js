// ============================================================
// middleware/authMiddleware.js — JWT Authentication Guard
// ============================================================
// Middleware runs BEFORE the route handler
// protect() checks if the user has a valid access token
// authorizeRoles() checks if the user has the right role
//
// How it works:
// 1. Client sends request with header: Authorization: Bearer <token>
// 2. protect() extracts and verifies the token
// 3. If valid → attaches user info to req.user → continues to route
// 4. If invalid → returns 401 Unauthorized
// ============================================================

const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utils/apiResponse");

// -------------------------------------------------------
// protect — Verifies the Access Token
// Add this to any route that requires login
// Example: router.get("/profile", protect, getProfile)
// -------------------------------------------------------
const protect = (req, res, next) => {
  // Get the Authorization header from the request
  // It should look like: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  const authHeader = req.headers.authorization;

  // Check if header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(res, 401, "Not authorized, no token");
  }

  // Extract just the token part (remove "Bearer " prefix)
  const token = authHeader.split(" ")[1];

  if (!token) {
    return errorResponse(res, 401, "Not authorized, token missing");
  }

  try {
    // jwt.verify() checks:
    // 1. Is the token signature valid? (not tampered)
    // 2. Has the token expired?
    // If both pass, it returns the decoded payload
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Make sure the token has the required fields
    if (!decoded.id || !decoded.role) {
      return errorResponse(res, 401, "Invalid token payload");
    }

    // Attach user info to the request object
    // Now any route handler can access req.user.id and req.user.role
    req.user = { id: decoded.id, role: decoded.role };

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    // jwt.verify throws an error if token is invalid or expired
    return errorResponse(res, 401, "Not authorized, token invalid or expired");
  }
};

// -------------------------------------------------------
// authorizeRoles — Role-Based Access Control
// Use AFTER protect() to restrict routes to specific roles
// Example: router.post("/add", protect, authorizeRoles("admin"), addEmployee)
// -------------------------------------------------------
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // req.user.role was set by protect() above
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 403, "Access denied: insufficient permissions");
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
