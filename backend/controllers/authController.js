// ============================================================
// controllers/authController.js — Authentication Logic
// ============================================================
// Controllers handle the actual business logic for each route
// This file handles: Login, Token Refresh, and Logout
//
// Flow:
// Login   → verify credentials → issue Access Token + Refresh Token
// Refresh → verify Refresh Token → issue new Access Token (rotate refresh)
// Logout  → delete Refresh Token from DB → clear cookie
// ============================================================

const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} = require("../utils/generateTokens");

// -------------------------------------------------------
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public (no token needed)
// -------------------------------------------------------
const login = asyncHandler(async (req, res) => {
  // Destructure email and password from request body
  const { email, password } = req.body;

  // Step 1: Validate that both fields are provided
  if (!email || !password) {
    const missing = !email ? "email" : "password";
    return errorResponse(res, 400, `Missing required field: ${missing}`);
  }

  // Step 2: Find user by email in the database
  const user = await User.findOne({ email });

  // Step 3: Check if user exists AND password matches
  // We use a single generic message to prevent "user enumeration"
  // (attacker shouldn't know if email exists or password is wrong)
  if (!user || !(await user.matchPassword(password))) {
    return errorResponse(res, 401, "Invalid credentials");
  }

  // Step 4: Check if account is active
  if (!user.isActive) {
    return errorResponse(res, 401, "Account is deactivated");
  }

  // Step 5: Generate tokens
  // Access Token → short-lived (15 min), sent in response body
  // Refresh Token → long-lived (7 days), sent as HTTP-only cookie
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  // Step 6: Set refresh token as a secure cookie
  setRefreshTokenCookie(res, refreshToken);

  // Step 7: Send success response with access token and user info
  return successResponse(res, 200, "Login successful", {
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      designation: user.designation,
    },
  });
});

// -------------------------------------------------------
// @desc    Refresh access token using refresh token cookie
// @route   POST /api/auth/refresh
// @access  Public (requires valid refreshToken cookie)
// -------------------------------------------------------
const refresh = asyncHandler(async (req, res) => {
  // Step 1: Get refresh token from cookie
  // (Browser automatically sends cookies with requests)
  const token = req.cookies.refreshToken;

  // If no cookie found, user is not logged in
  if (!token) {
    return errorResponse(res, 401, "No refresh token");
  }

  // Step 2: Verify the JWT signature and check expiry
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    // Token is expired or tampered — clear the cookie and reject
    clearRefreshTokenCookie(res);
    return errorResponse(res, 401, "Invalid or expired refresh token");
  }

  // Step 3: Check if token exists in our database
  // Even if JWT is valid, we check DB to handle revoked tokens
  // (e.g. user logged out on another device)
  const storedToken = await RefreshToken.findOne({ token });
  if (!storedToken) {
    clearRefreshTokenCookie(res);
    return errorResponse(res, 401, "Refresh token revoked");
  }

  // Step 4: Find the user this token belongs to
  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    clearRefreshTokenCookie(res);
    return errorResponse(res, 401, "User not found or deactivated");
  }

  // Step 5: TOKEN ROTATION
  // Delete the old refresh token from database
  // Issue a brand new refresh token
  // This limits damage if a token is stolen — old one becomes invalid
  await RefreshToken.deleteOne({ token });

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = await generateRefreshToken(user);

  // Step 6: Set new refresh token cookie
  setRefreshTokenCookie(res, newRefreshToken);

  // Step 7: Send new access token to frontend
  return successResponse(res, 200, "Token refreshed", {
    accessToken: newAccessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      designation: user.designation,
    },
  });
});

// -------------------------------------------------------
// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
// -------------------------------------------------------
const logout = asyncHandler(async (req, res) => {
  // Step 1: Get the refresh token from cookie
  const token = req.cookies.refreshToken;

  // Step 2: If token exists, delete it from the database
  // This prevents the token from being used again
  if (token) {
    await RefreshToken.deleteOne({ token });
  }

  // Step 3: Clear the cookie from the browser
  clearRefreshTokenCookie(res);

  // Step 4: Always return 200 — even if no token was present
  return successResponse(res, 200, "Logged out successfully");
});

module.exports = { login, refresh, logout };
