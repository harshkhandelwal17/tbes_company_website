import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Employee from '@/models/Employee';
import Attendance from '@/models/Attendance';
import { verifyEmployee } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Helper: get today's date string in YYYY-MM-DD (IST)
function getTodayIST(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

// GET — today's attendance status for logged-in employee
export async function GET() {
  try {
    const payload = await verifyEmployee();
    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const today = getTodayIST();

    const record = await Attendance.findOne({ employee: payload.id, date: today });

    return NextResponse.json({
      date: today,
      record: record || null,
    });
  } catch (error: any) {
    console.error('GET attendance error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
