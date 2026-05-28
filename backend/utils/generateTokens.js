// ============================================================
// utils/generateTokens.js — JWT Token Helpers
// This file has all functions related to creating and
// managing Access Tokens and Refresh Tokens
// ============================================================

const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");

const parseExpiry = (expiry) => {
  // Parse strings like "15m", "7d", "1h" into milliseconds
  if (!expiry) return 7 * 24 * 60 * 60 * 1000;
  const match = expiry.match(/^(\d+)([smhd])$/i);
  if (!match) return 7 * 24 * 60 * 60 * 1000;

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * (multipliers[unit] || 7 * 24 * 60 * 60 * 1000);
};

// -------------------------------------------------------
// generateAccessToken
// Creates a short-lived JWT (15 minutes)
// This token is sent in every API request header
// Payload contains user ID and role
// -------------------------------------------------------
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,   // user's MongoDB ID
      role: user.role // "admin" or "employee"
    },
    process.env.ACCESS_TOKEN_SECRET, // secret key from .env
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } // "15m"
  );
};

// -------------------------------------------------------
// generateRefreshToken
// Creates a long-lived JWT (7 days)
// Also saves it to the database (RefreshToken collection)
// so we can verify and revoke it later
// -------------------------------------------------------
const generateRefreshToken = async (user) => {
  // Create the JWT string
  const token = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET, // different secret from access token
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } // "7d"
  );

  // Calculate expiry date using REFRESH_TOKEN_EXPIRY from .env
  const expiresAt = new Date(Date.now() + parseExpiry(process.env.REFRESH_TOKEN_EXPIRY));

  // Save token to database so we can validate/revoke it
  await RefreshToken.create({ token, user: user._id, expiresAt });

  return token;
};

// -------------------------------------------------------
// setRefreshTokenCookie
// Sends the refresh token as an HTTP-only cookie
// HTTP-only = JavaScript cannot read it (prevents XSS attacks)
// Secure = only sent over HTTPS in production
// SameSite = prevents CSRF attacks
// -------------------------------------------------------
const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,  // JS cannot access this cookie
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict", // cookie only sent to same site
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: "/", // cookie available for all routes
  });
};

// -------------------------------------------------------
// clearRefreshTokenCookie
// Removes the refresh token cookie (used on logout)
// Setting maxAge: 0 tells the browser to delete the cookie
// -------------------------------------------------------
const clearRefreshTokenCookie = (res) => {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0, // expire immediately = delete cookie
    path: "/",
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
};
