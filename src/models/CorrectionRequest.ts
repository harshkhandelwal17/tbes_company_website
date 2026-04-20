import mongoose from "mongoose";

const CorrectionRequestSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: { type: String, required: true }, // YYYY-MM-DD
    requestedPunchIn: { type: Date, required: true },
    requestedPunchOut: { type: Date, required: true },
    reason: {
      type: String,
      enum: [
        "Forgot to punch",
        "System/App issue",
        "Field duty / Client visit",
        "Power outage",
        "Other",
      ],
      required: true,
    },
    details: { type: String, default: "" }, // optional extra info
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedBy: { type: String, default: "" },  // admin email
    reviewedAt: { type: Date, default: null },
    adminRemarks: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.CorrectionRequest ||
  mongoose.model("CorrectionRequest", CorrectionRequestSchema);
