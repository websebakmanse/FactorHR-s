// ============================================================
// config/db.js — MongoDB Connection
// This file connects our app to the MongoDB database
// ============================================================

const mongoose = require("mongoose");

// connectDB is an async function because connecting to DB takes time
const connectDB = async () => {
  try {
    // mongoose.connect() returns a connection object
    // MONGO_URI comes from the .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Log which host we connected to (useful for debugging)
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, print the error and stop the app
    // process.exit(1) means "exit with error"
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
