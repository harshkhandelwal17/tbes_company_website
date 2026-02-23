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

        // Advanced Fields
        benefits: { type: [String], default: [] },
        features: { type: [String], default: [] },
        process: [{
            title: { type: String, required: true },
            description: { type: String, required: true }
        }],
        keyDeliverables: { type: [String], default: [] },
        faqs: [{
            question: { type: String, required: true },
            answer: { type: String, required: true }
        }],

        order: { type: Number, default: 0 },
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Avoid model overwrite issue in dev and force schema refresh
if (models.Service) {
    delete (mongoose as any).models.Service;
}
const Service = model("Service", serviceSchema);
export default Service;
