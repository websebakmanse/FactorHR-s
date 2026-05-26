require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const connectDB = require("../config/db");

const seedUsers = async () => {
  await connectDB();

  await User.deleteMany({ email: { $in: ["admin@me.com", "user@us.com"] } });

  await User.create([
    {
      name: "Admin User",
      email: "admin@me.com",
      password: "123",
      role: "admin",
      department: "HR",
      designation: "HR Manager",
      employeeId: "EMP001",
    },
    {
      name: "Employee User",
      email: "user@us.com",
      password: "123",
      role: "employee",
      department: "MERN",
      designation: "Software Engineer",
      employeeId: "EMP002",
    },
  ]);

  console.log("✅ Seed users created: admin@me.com and user@us.com (password: 123)");
  process.exit(0);
};

seedUsers().catch((err) => {
  console.error(err);
  process.exit(1);
});
