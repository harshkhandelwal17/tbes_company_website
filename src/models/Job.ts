import mongoose, { Schema, models, model } from "mongoose";

const jobSchema = new Schema(
  {
    title: { type: String, required: true },
    department: { type: String, required: false }, // Added
    location: { type: String, required: true },
    type: { type: String, required: true }, // e.g., Full-time, Part-time
    experience: { type: String, required: false }, // Added
    salary: { type: String, required: false }, // Added
    description: { type: String, required: true },
    requirements: { type: [String], required: false }, // Changed to Array
    responsibilities: { type: [String], required: false }, // Changed to Array
    qualifications: { type: String, required: false }, // Keeping for backward compatibility if needed, or remove
    active: { type: Boolean, default: true },
    status: { type: String, default: 'active' }, // Added to match Admin Panel
  },
  { timestamps: true }
);

// Avoid model overwrite issue in dev
const Job = models.Job || model("Job", jobSchema);
export default Job;
