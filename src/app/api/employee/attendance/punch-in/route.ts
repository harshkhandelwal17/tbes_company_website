import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Employee from '@/models/Employee';
import Attendance from '@/models/Attendance';
import AttendanceConfig from '@/models/AttendanceConfig';
import Holiday from '@/models/Holiday';
import { verifyEmployee } from '@/lib/auth';

function getTodayIST(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

function getPunchInStatus(
  employee: { shiftStartHour: number; shiftStartMinute: number },
  punchInTime: Date,
  graceMinutes: number
): 'present' | 'late' {
  const ist = new Date(punchInTime.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const shiftCutoff = employee.shiftStartHour * 60 + employee.shiftStartMinute + graceMinutes;
  const nowMinutes = ist.getHours() * 60 + ist.getMinutes();
  return nowMinutes > shiftCutoff ? 'late' : 'present';
}

export async function POST(req: Request) {
  try {
    const payload = await verifyEmployee();
    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const employee = await Employee.findById(payload.id);
    if (!employee || employee.status !== 'active') {
      return NextResponse.json({ message: 'Employee account not found or inactive' }, { status: 403 });
    }

    const today = getTodayIST();

    // Load global config
    let config = await AttendanceConfig.findOne({});
    if (!config) config = await AttendanceConfig.create({});

    // Block on holidays
    const holiday = await Holiday.findOne({ date: today });
    if (holiday) {
      return NextResponse.json(
        { message: `Today is a holiday: ${holiday.name}. No punch-in required.` },
        { status: 400 }
      );
    }

    // Block on week-off days
    const dayOfWeek = new Date().getDay();
    if ((config.weekOffDays as number[]).includes(dayOfWeek)) {
      return NextResponse.json(
        { message: 'Today is a week off. Enjoy your day!' },
        { status: 400 }
      );
    }

    const existing = await Attendance.findOne({ employee: payload.id, date: today });
    if (existing?.punchIn) {
      return NextResponse.json({ message: 'You have already punched in today.' }, { status: 409 });
    }

    const now = new Date();
    // Per-employee grace if set, else global config
    const graceMinutes =
      employee.graceMinutes !== undefined ? employee.graceMinutes : config.graceMinutes;
    const status = getPunchInStatus(employee, now, graceMinutes);
    const ip = getClientIP(req);

    const record = await Attendance.findOneAndUpdate(
      { employee: payload.id, date: today },
      {
        $set: {
          punchIn: now,
          punchOut: null,
          totalHours: 0,
          status,
          punchInIP: ip,
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: `Punched in at ${now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}${status === 'late' ? ' — Marked Late' : ''}`,
      record,
      status,
    });
  } catch (error) {
    console.error('Punch-in error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
