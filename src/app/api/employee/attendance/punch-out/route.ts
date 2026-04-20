import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import AttendanceConfig from '@/models/AttendanceConfig';
import { verifyEmployee } from '@/lib/auth';

function getTodayIST(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

function calcHours(punchIn: Date, punchOut: Date): number {
  const ms = punchOut.getTime() - punchIn.getTime();
  return Math.round((ms / (1000 * 60 * 60)) * 100) / 100;
}

export async function POST(req: Request) {
  try {
    const payload = await verifyEmployee();
    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();

    let config = await AttendanceConfig.findOne({});
    if (!config) config = await AttendanceConfig.create({});

    const today = getTodayIST();
    const record = await Attendance.findOne({ employee: payload.id, date: today });

    if (!record || !record.punchIn) {
      return NextResponse.json(
        { message: 'You have not punched in today. Please punch in first.' },
        { status: 400 }
      );
    }

    if (record.punchOut) {
      return NextResponse.json({ message: 'You have already punched out today.' }, { status: 409 });
    }

    const now = new Date();
    const totalHours = calcHours(record.punchIn, now);
    const ip = getClientIP(req);

    // Status logic using DB config thresholds
    let finalStatus: string;
    if (totalHours < config.absentThresholdHours) {
      finalStatus = 'absent'; // too few hours — count as absent
    } else if (totalHours < config.halfDayThresholdHours) {
      finalStatus = 'half_day';
    } else {
      finalStatus = record.status; // keep 'present' or 'late'
    }

    // Overtime flag
    const isOvertime = totalHours > config.overtimeAfterHours;

    // Early leave check
    const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const shiftEndMinutes = config.shiftEndHour * 60 + config.shiftEndMinute;
    const earlyLeaveMinutes = config.earlyLeaveGraceMinutes;
    const currentMinutes = ist.getHours() * 60 + ist.getMinutes();
    const isEarlyLeave = currentMinutes < (shiftEndMinutes - earlyLeaveMinutes);

    record.punchOut = now;
    record.totalHours = totalHours;
    record.status = finalStatus;
    record.punchOutIP = ip;
    await record.save();

    const hoursDisplay = Math.floor(totalHours);
    const minutesDisplay = Math.round((totalHours - hoursDisplay) * 60);

    let msg = `Punched out. You worked ${hoursDisplay}h ${minutesDisplay}m today.`;
    if (isOvertime) msg += ' Great work — overtime logged!';
    else if (isEarlyLeave) msg += ' Note: Early leave recorded.';

    return NextResponse.json({
      success: true,
      message: msg,
      record,
      isOvertime,
      isEarlyLeave,
    });
  } catch (error) {
    console.error('Punch-out error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
