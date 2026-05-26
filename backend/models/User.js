// ============================================================
// models/User.js — User Schema (Database Structure)
// This defines what a User document looks like in MongoDB
// ============================================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Used to hash passwords securely

// Define the shape of a User document in MongoDB
const userSchema = new mongoose.Schema(
  {
    // Employee's full name
    name: {
      type: String,
      required: true,
      trim: true, // removes extra spaces
    },

    // Email must be unique — used for login
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // always store as lowercase
      trim: true,
    },

    // Password will be hashed before saving (see pre-save hook below)
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // Unique employee ID like EMP001, EMP002
    employeeId: {
      type: String,
      unique: true,
      sparse: true, // allows multiple null values (not all users have an ID yet)
    },

    // Role decides what the user can see: admin = HR panel, employee = employee panel
    role: {
      type: String,
      enum: ["admin", "employee"], // only these two values are allowed
      default: "employee",
    },

    department: { type: String, trim: true },
    designation: { type: String, trim: true },
    phone: { type: String, trim: true },
    profileImage: { type: String, default: "" },
    joiningDate: { type: Date },

    // Leave balance — how many leaves the employee has left
    leaveBalance: {
      casual: { type: Number, default: 10 },
      sick: { type: Number, default: 4 },
      privilege: { type: Number, default: 15 },
    },

    // GPS coordinates of the office (used for attendance validation)
    officeLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },

    // If false, the employee is deactivated and cannot login
    isActive: { type: Boolean, default: true },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// -------------------------------------------------------
// PRE-SAVE HOOK
// This runs automatically BEFORE saving a user to the database
// It hashes the password so we never store plain text passwords
// -------------------------------------------------------
userSchema.pre("save", async function (next) {
  // Only hash if the password was changed (not on every save)
  if (!this.isModified("password")) return next();

  // bcrypt.hash(password, saltRounds)
  // saltRounds = 10 means it runs the hashing algorithm 2^10 = 1024 times
  // More rounds = more secure but slower
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// -------------------------------------------------------
// INSTANCE METHOD: matchPassword
// Called when user tries to login
// Compares the entered password with the stored hashed password
// -------------------------------------------------------
userSchema.methods.matchPassword = async function (enteredPassword) {
  // bcrypt.compare returns true if passwords match, false otherwise
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the model so other files can use it
module.exports = mongoose.model("User", userSchema);
