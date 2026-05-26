// ============================================================
// utils/asyncHandler.js — Async Error Wrapper
// ============================================================
// Problem: Every async route handler needs try/catch
// Solution: Wrap it with asyncHandler — it catches errors automatically
//
// Without asyncHandler:
//   const login = async (req, res) => {
//     try { ... } catch(err) { next(err) }
//   }
//
// With asyncHandler:
//   const login = asyncHandler(async (req, res) => { ... })
//   No try/catch needed! Errors go to errorMiddleware automatically.
// ============================================================

const asyncHandler = (fn) => (req, res, next) => {
  // Promise.resolve wraps the function
  // .catch(next) sends any error to the error middleware
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
