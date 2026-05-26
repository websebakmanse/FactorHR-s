const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utils/apiResponse");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(res, 401, "Not authorized, no token");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return errorResponse(res, 401, "Not authorized, token missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded.id || !decoded.role) {
      return errorResponse(res, 401, "Invalid token payload");
    }

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    return errorResponse(res, 401, "Not authorized, token invalid or expired");
  }
};

// Role-based access control
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 403, "Access denied: insufficient permissions");
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
