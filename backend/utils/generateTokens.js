const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } // 15m
  );
};

const generateRefreshToken = async (user) => {
  const token = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } // 7d
  );

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await RefreshToken.create({ token, user: user._id, expiresAt });

  return token;
};

const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    path: "/",
  });
};

const clearRefreshTokenCookie = (res) => {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
};
