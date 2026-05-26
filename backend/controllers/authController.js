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

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    const missing = !email ? "email" : "password";
    return errorResponse(res, 400, `Missing required field: ${missing}`);
  }

  // Find user — generic 401 to prevent user enumeration
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return errorResponse(res, 401, "Invalid credentials");
  }

  if (!user.isActive) {
    return errorResponse(res, 401, "Account is deactivated");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  setRefreshTokenCookie(res, refreshToken);

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

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public (requires refreshToken cookie)
const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return errorResponse(res, 401, "No refresh token");
  }

  // Verify JWT signature and expiry
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    clearRefreshTokenCookie(res);
    return errorResponse(res, 401, "Invalid or expired refresh token");
  }

  // Check token exists in store (not revoked/rotated)
  const storedToken = await RefreshToken.findOne({ token });
  if (!storedToken) {
    clearRefreshTokenCookie(res);
    return errorResponse(res, 401, "Refresh token revoked");
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    clearRefreshTokenCookie(res);
    return errorResponse(res, 401, "User not found or deactivated");
  }

  // Token rotation — delete old, issue new
  await RefreshToken.deleteOne({ token });

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = await generateRefreshToken(user);

  setRefreshTokenCookie(res, newRefreshToken);

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

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    await RefreshToken.deleteOne({ token });
  }

  clearRefreshTokenCookie(res);
  return successResponse(res, 200, "Logged out successfully");
});

module.exports = { login, refresh, logout };
