import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true, default: "" },
    designation: { type: String, trim: true, default: "" },
    department: { type: String, trim: true, default: "" },
    joiningDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["active", "inactive", "terminated"],
      default: "active",
    },
    role: {
      type: String,
      enum: ["employee", "team_lead", "hr_admin"],
      default: "employee",
    },
    // Shift config — default: 9:00 AM start, 15 min grace
    shiftStartHour: { type: Number, default: 9 },
    shiftStartMinute: { type: Number, default: 0 },
    graceMinutes: { type: Number, default: 15 },
  },
  { timestamps: true }
);

export default mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
