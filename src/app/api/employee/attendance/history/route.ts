import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import { verifyEmployee } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/employee/attendance/history
 * Query params:
 *   month=YYYY-MM  → returns all records for that month (default: current month)
 *
 * Returns attendance records + summary stats.
 */
export async function GET(req: Request) {
  try {
    const payload = await verifyEmployee();
    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);

    // Default to current month in IST
    const defaultMonth = new Date().toLocaleDateString('en-CA', {
      timeZone: 'Asia/Kolkata',
    }).slice(0, 7); // YYYY-MM

    const month = searchParams.get('month') || defaultMonth;

    // Validate YYYY-MM format
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json({ message: 'Invalid month format. Use YYYY-MM.' }, { status: 400 });
    }

    await connectDB();

    // All records for this employee in this month, sorted by date
    const records = await Attendance.find({
      employee: payload.id,
      date: { $regex: `^${month}` },
    }).sort({ date: 1 });

    // Summary stats
    const summary = {
      present: 0,
      late: 0,
      half_day: 0,
      absent: 0,
      incomplete: 0,
      wfh: 0,
      totalHours: 0,
    };

    records.forEach((r) => {
      if (r.status in summary) {
        (summary as any)[r.status]++;
      }
      summary.totalHours += r.totalHours || 0;
    });

    summary.totalHours = Math.round(summary.totalHours * 100) / 100;

    return NextResponse.json({ records, summary, month });
  } catch (error: any) {
    console.error('Attendance history error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
