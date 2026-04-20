import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AttendanceConfig from '@/models/AttendanceConfig';
import { verifyAdmin } from '@/lib/auth';

/**
 * GET  /api/admin/attendance-config  — get current config
 * PUT  /api/admin/attendance-config  — update config (admin only)
 */
export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    let config = await AttendanceConfig.findOne({});
    if (!config) config = await AttendanceConfig.create({});
    return NextResponse.json({ success: true, config });
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const body = await req.json();

    // Only allow updating known fields — prevent arbitrary injection
    const allowed = [
      'defaultShiftStartHour', 'defaultShiftStartMinute',
      'graceMinutes', 'absentThresholdHours', 'halfDayThresholdHours',
      'fullDayMinHours', 'shiftEndHour', 'shiftEndMinute',
      'earlyLeaveGraceMinutes', 'overtimeAfterHours',
      'weekOffDays', 'autoIncompleteEnabled', 'companyName',
    ];

    const update: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) update[key] = body[key];
    }

    let config = await AttendanceConfig.findOne({});
    if (!config) {
      config = await AttendanceConfig.create(update);
    } else {
      Object.assign(config, update);
      await config.save();
    }

    return NextResponse.json({ success: true, config });
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
