import mongoose, { Schema, models, model } from "mongoose";

const jobSchema = new Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true }, // e.g., Full-time, Part-time
    description: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Avoid model overwrite issue in dev
const Job = models.Job || model("Job", jobSchema);
export default Job;
