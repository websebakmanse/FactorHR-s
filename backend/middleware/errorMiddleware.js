// ============================================================
// middleware/errorMiddleware.js — Global Error Handler
// ============================================================
// This is the LAST middleware in app.js
// Any error thrown anywhere in the app ends up here
//
// How errors reach here:
// - asyncHandler catches async errors and calls next(err)
// - Express automatically calls this for synchronous errors
//
// Response format:
//   { success: false, message: "...", stack: "..." (dev only) }
// ============================================================

const errorHandler = (err, req, res, next) => {
  // If no status code was set, default to 500 (Internal Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",

    // Show stack trace in development for debugging
    // Hide it in production so users don't see internal details
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;
