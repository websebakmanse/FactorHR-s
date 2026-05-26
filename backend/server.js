// ============================================================
// server.js — Entry point of the backend application
// This file starts the server after connecting to MongoDB
// ============================================================

// Load all environment variables from .env file
// (like PORT, MONGO_URI, JWT secrets)
require("dotenv").config();

// Import the Express app we configured in app.js
const app = require("./app");

// Import the function that connects to MongoDB
const connectDB = require("./config/db");

// Read the PORT from .env file, or use 5000 as default
const PORT = process.env.PORT || 5000;

// Step 1: Connect to MongoDB first
// Step 2: Only start the server if DB connection is successful
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });
});
