import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Holiday from '@/models/Holiday';
import { verifyAdmin } from '@/lib/auth';

interface RouteParams {
  params: { id: string };
}

/**
 * DELETE /api/admin/holidays/[id]  — remove a holiday
 * PUT    /api/admin/holidays/[id]  — update a holiday
 */
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { name, type, description } = await req.json();
    const holiday = await Holiday.findByIdAndUpdate(
      params.id,
      { $set: { name, type, description } },
      { new: true }
    );
    if (!holiday) return NextResponse.json({ message: 'Holiday not found.' }, { status: 404 });
    return NextResponse.json({ success: true, holiday });
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    await Holiday.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: 'Holiday deleted.' });
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
