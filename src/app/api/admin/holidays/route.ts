import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Holiday from '@/models/Holiday';
import { verifyAdmin } from '@/lib/auth';

/**
 * GET  /api/admin/holidays?year=2025       — list holidays for a year
 * POST /api/admin/holidays                 — add a holiday
 */
export async function GET(req: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year') || new Date().getFullYear().toString();

    const holidays = await Holiday.find({
      date: { $gte: `${year}-01-01`, $lte: `${year}-12-31` },
    }).sort({ date: 1 });

    return NextResponse.json({ success: true, holidays });
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { date, name, type, description } = await req.json();

    if (!date || !name) {
      return NextResponse.json({ message: 'Date and name are required.' }, { status: 400 });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ message: 'Date must be YYYY-MM-DD.' }, { status: 400 });
    }

    const existing = await Holiday.findOne({ date });
    if (existing) {
      return NextResponse.json({ message: 'A holiday already exists on this date.' }, { status: 409 });
    }

    const holiday = await Holiday.create({ date, name, type: type || 'company', description: description || '' });
    return NextResponse.json({ success: true, holiday }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
