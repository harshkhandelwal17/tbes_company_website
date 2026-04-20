import mongoose from "mongoose";

const HolidaySchema = new mongoose.Schema(
  {
    // YYYY-MM-DD
    date: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["national", "optional", "restricted", "company"],
      default: "company",
    },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

HolidaySchema.index({ date: 1 });

export default mongoose.models.Holiday || mongoose.model("Holiday", HolidaySchema);
