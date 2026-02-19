import mongoose, { Schema, models, model } from "mongoose";

const serviceSchema = new Schema(
    {
        slug: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        icon: { type: String, required: true }, // Lucide icon name string
        description: { type: String, required: true },
        details: { type: [String], required: false },
        software: { type: [String], required: false },
        image: { type: String, required: false },
        color: { type: String, default: 'blue' }, // For UI theming
        outcome: { type: String, default: 'Enhanced Efficiency' }, // For Homepage
        order: { type: Number, default: 0 },
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Avoid model overwrite issue in dev
const Service = models.Service || model("Service", serviceSchema);
export default Service;
