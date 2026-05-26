// ============================================================
// models/RefreshToken.js — Refresh Token Storage
// We store refresh tokens in the database so we can:
// 1. Check if a token is valid (not revoked)
// 2. Delete it when user logs out
// 3. Rotate it (replace old with new) on every refresh
// ============================================================

const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  // The actual JWT refresh token string
  token: {
    type: String,
    required: true,
    unique: true,
  },

  // Which user this token belongs to
  // ref: "User" means it links to the User model (like a foreign key)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // When this token expires (7 days from creation)
  expiresAt: {
    type: Date,
    required: true,
  },

  // When this token was created
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// -------------------------------------------------------
// TTL INDEX (Time To Live)
// MongoDB will automatically DELETE documents where
// expiresAt has passed. No manual cleanup needed!
// expireAfterSeconds: 0 means "delete exactly at expiresAt time"
// -------------------------------------------------------
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
