import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";

export async function GET() {
  await connectDB();
  const jobs = await Job.find().sort({ createdAt: -1 });
  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();

  try {
    const job = await Job.create(data);
    return NextResponse.json({ message: "Job created successfully", job });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
