import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";


export const dynamic = 'force-dynamic';

export async function GET() {
  await connectDB();
  const jobs = await Job.find().sort({ createdAt: -1 });
  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();

  try {
    console.log("Creating job with data:", JSON.stringify(data, null, 2));
    const job = await Job.create(data);
    console.log("Job created:", job);
    return NextResponse.json({ message: "Job created successfully", job });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const data = await req.json();

  if (!id) return NextResponse.json({ error: "Job ID required" }, { status: 400 });

  try {
    const job = await Job.findByIdAndUpdate(id, data, { new: true });
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
    return NextResponse.json({ message: "Job updated successfully", job });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Job ID required" }, { status: 400 });

  try {
    const job = await Job.findByIdAndDelete(id);
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
