import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        company: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            default: 5,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
