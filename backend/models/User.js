const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    employeeId: { type: String, unique: true, sparse: true },
    role: { type: String, enum: ["admin", "employee"], default: "employee" },
    department: { type: String, trim: true },
    designation: { type: String, trim: true },
    phone: { type: String, trim: true },
    profileImage: { type: String, default: "" },
    joiningDate: { type: Date },
    leaveBalance: {
      casual: { type: Number, default: 10 },
      sick: { type: Number, default: 4 },
      privilege: { type: Number, default: 15 },
    },
    officeLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
