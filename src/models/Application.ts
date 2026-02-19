import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        resumeUrl: {
            type: String,
            required: true,
        },
        coverLetter: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            enum: ["pending", "reviewed", "shortlisted", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
