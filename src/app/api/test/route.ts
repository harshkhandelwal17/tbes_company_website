// src/app/api/test/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB(); // Connect using Mongoose
    return NextResponse.json({ message: "✅ MongoDB (Mongoose) connected successfully!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
