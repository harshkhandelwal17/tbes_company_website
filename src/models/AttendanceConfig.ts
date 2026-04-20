import mongoose from "mongoose";

/**
 * Global attendance configuration — single document (singleton pattern).
 * Admin can update these rules from the settings panel.
 */
const AttendanceConfigSchema = new mongoose.Schema(
  {
    // --- Shift defaults (fallback when employee doesn't have custom shift) ---
    defaultShiftStartHour: { type: Number, default: 9 },
    defaultShiftStartMinute: { type: Number, default: 0 },

    // --- Grace period (minutes after shift start before marking late) ---
    graceMinutes: { type: Number, default: 15 },

    // --- Hours thresholds ---
    // Employee worked < absentThresholdHours → absent (too little to count as half day)
    absentThresholdHours: { type: Number, default: 1 },
    // Employee worked < halfDayThresholdHours → half_day
    halfDayThresholdHours: { type: Number, default: 4 },
    // Full day requires at least fullDayMinHours
    fullDayMinHours: { type: Number, default: 8 },

    // --- Early punch-out ---
    // If employee punches out sooner than (shiftEnd - earlyLeaveMinutes), they get a note
    // shiftEndHour / shiftEndMinute — expected end of shift
    shiftEndHour: { type: Number, default: 18 },
    shiftEndMinute: { type: Number, default: 0 },
    // Minutes before shiftEnd that are still allowed (e.g., 15 = 5:45 PM is fine for 6 PM shift)
    earlyLeaveGraceMinutes: { type: Number, default: 15 },

    // --- Overtime ---
    // Hours beyond fullDayMinHours before overtime kicks in
    overtimeAfterHours: { type: Number, default: 9 },

    // --- Work week ---
    // Days off: 0=Sunday, 6=Saturday. E.g., [0,6] = weekend
    weekOffDays: { type: [Number], default: [0, 6] },

    // --- Auto-incomplete ---
    // If employee punched in but no punch-out by midnight, set status to 'incomplete'
    autoIncompleteEnabled: { type: Boolean, default: true },

    // --- Label for UI display ---
    companyName: { type: String, default: "TBES Global" },
    timezone: { type: String, default: "Asia/Kolkata" },
  },
  { timestamps: true }
);

export default mongoose.models.AttendanceConfig ||
  mongoose.model("AttendanceConfig", AttendanceConfigSchema);
