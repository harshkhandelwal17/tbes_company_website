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
        coverPhotoUrl: {
            type: String,
            required: false,
            default: '',
        },
        additionalDocuments: {
            type: [String],
            default: [],
        },
        coverLetterUrl: {
            type: String,
            required: false,
            default: '',
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
