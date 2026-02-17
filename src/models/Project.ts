import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: false,
        },
        lod: {
            type: Number,
            required: false,
        },
        sow: {
            type: String, // Scope of Work
            required: false,
        },
        projectType: {
            type: String,
            required: false,
        },
        area: {
            type: Number,
            required: false,
        },
        imageUrls: {
            type: String, // Storing as JSON string
            required: false,
        },
        modelUrl: {
            type: String,
            required: false,
        },
        modelType: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
