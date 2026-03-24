import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const showAll = req.nextUrl.searchParams.get('all') === 'true';

  if (showAll) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  // Public: only active jobs. Admin (?all=true): all jobs
  const filter = showAll ? {} : { status: 'active', active: true };
  const jobs = await Job.find(filter).sort({ createdAt: -1 });
  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const data = await req.json();

  try {
    // Sync active boolean with status string — single source of truth
    const isActive = data.status !== 'inactive';
    const job = await Job.create({ ...data, active: isActive });
    return NextResponse.json({ message: "Job created successfully", job });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const data = await req.json();

  if (!id) return NextResponse.json({ error: "Job ID required" }, { status: 400 });

  try {
    // Sync active boolean with status string on every update
    const isActive = data.status !== 'inactive';
    const job = await Job.findByIdAndUpdate(id, { ...data, active: isActive }, { new: true });
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
    return NextResponse.json({ message: "Job updated successfully", job });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
