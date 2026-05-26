// ============================================================
// utils/apiResponse.js — Standardized API Responses
// ============================================================
// Instead of writing res.status(200).json({...}) everywhere,
// we use these helper functions for consistent response format
//
// Success response format:
//   { success: true, message: "...", data: {...} }
//
// Error response format:
//   { success: false, message: "..." }
// ============================================================

// Send a success response
// statusCode: HTTP status (200, 201, etc.)
// message: human-readable message
// data: the actual response data (optional)
const successResponse = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Send an error response
// statusCode: HTTP status (400, 401, 404, 500, etc.)
// message: what went wrong
const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { successResponse, errorResponse };
