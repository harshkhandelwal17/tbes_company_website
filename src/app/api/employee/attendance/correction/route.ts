import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import CorrectionRequest from '@/models/CorrectionRequest';
import { verifyEmployee } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// ────────────────────────────────────────────────────────────────
// GET — fetch this employee's correction requests (latest first)
// ────────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const payload = await verifyEmployee();
    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const requests = await CorrectionRequest.find({ employee: payload.id })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ requests });
  } catch (error: any) {
    console.error('GET correction requests error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// ────────────────────────────────────────────────────────────────
// POST — submit a new correction request
// ────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const payload = await verifyEmployee();
    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const body = await req.json();
    const { date, requestedPunchIn, requestedPunchOut, reason, details } = body;

    // Validations
    if (!date || !requestedPunchIn || !requestedPunchOut || !reason) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ message: 'Invalid date format. Use YYYY-MM-DD.' }, { status: 400 });
    }

    const punchInDate = new Date(requestedPunchIn);
    const punchOutDate = new Date(requestedPunchOut);

    if (isNaN(punchInDate.getTime()) || isNaN(punchOutDate.getTime())) {
      return NextResponse.json({ message: 'Invalid punch-in or punch-out time.' }, { status: 400 });
    }

    if (punchOutDate <= punchInDate) {
      return NextResponse.json(
        { message: 'Punch-out time must be after punch-in time.' },
        { status: 400 }
      );
    }

    // Don't allow future dates
    const todayIST = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    if (date > todayIST) {
      return NextResponse.json({ message: 'Cannot submit correction for a future date.' }, { status: 400 });
    }

    // Check for duplicate pending request for same date
    const existing = await CorrectionRequest.findOne({
      employee: payload.id,
      date,
      status: 'pending',
    });
    if (existing) {
      return NextResponse.json(
        { message: 'A pending correction request already exists for this date.' },
        { status: 409 }
      );
    }

    const request = await CorrectionRequest.create({
      employee: payload.id,
      date,
      requestedPunchIn: punchInDate,
      requestedPunchOut: punchOutDate,
      reason,
      details: details?.trim() || '',
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      message: 'Correction request submitted. Admin will review it.',
      request,
    });
  } catch (error: any) {
    console.error('POST correction request error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
