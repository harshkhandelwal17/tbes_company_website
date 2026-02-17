import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;

  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    const errorMsg = "❌ MONGODB_URI is not defined in environment variables. Please check your .env file or Vercel settings.";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    throw err;
  }
};

export default connectDB;
