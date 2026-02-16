import mongoose, { Schema, models, model } from "mongoose";

const contactSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: false },
        company: { type: String, required: false },
        serviceInterest: {
            type: String,
            enum: ['BIM Modeling', 'CAD Services', 'Scan to BIM', '3D Rendering', 'Other', 'General Inquiry'],
            default: 'General Inquiry'
        },
        subject: { type: String, required: true },
        message: { type: String, required: true },
        status: {
            type: String,
            enum: ['New', 'Read', 'Replied'],
            default: 'New'
        },
    },
    { timestamps: true }
);

// Avoid model overwrite issue in dev
const Contact = models.Contact || model("Contact", contactSchema);
export default Contact;
