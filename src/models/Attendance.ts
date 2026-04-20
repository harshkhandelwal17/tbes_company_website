import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    // YYYY-MM-DD string for easy querying without timezone issues
    date: { type: String, required: true },
    punchIn: { type: Date, default: null },
    punchOut: { type: Date, default: null },
    // Calculated at punch-out. Stored in hours (e.g., 8.5)
    totalHours: { type: Number, default: 0 },
    status: {
      type: String,
      enum: [
        "present",   // full day, on time
        "late",      // arrived after grace period, worked >= 4h
        "half_day",  // worked < 4 hours
        "incomplete",// punched in but never punched out
        "absent",    // no punch at all
        "wfh",       // work from home (manual by admin)
        "holiday",   // company holiday
        "weekend",   // Saturday/Sunday
      ],
      default: "absent",
    },
    punchInIP: { type: String, default: "" },
    punchOutIP: { type: String, default: "" },
    // Audit trail for manual edits by admin
    isManuallyEdited: { type: Boolean, default: false },
    editedBy: { type: String, default: "" },   // admin email
    editReason: { type: String, default: "" },
  },
  { timestamps: true }
);

// Compound unique index — one record per employee per day
AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);
