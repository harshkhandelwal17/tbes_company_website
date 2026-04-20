import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AttendanceConfig from '@/models/AttendanceConfig';
import { verifyAdmin, verifyEmployee } from '@/lib/auth';

/**
 * GET /api/attendance-config
 * Public to employees (so punch-in/out can read config),
 * but called server-side — just needs valid token (admin or employee).
 */
export async function GET() {
  try {
    await connectDB();
    // Return config (or defaults if none exists yet)
    let config = await AttendanceConfig.findOne({});
    if (!config) {
      config = await AttendanceConfig.create({});
    }
    return NextResponse.json({ success: true, config });
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
