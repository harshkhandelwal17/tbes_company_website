import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CorrectionRequest from '@/models/CorrectionRequest';
import Attendance from '@/models/Attendance';
import { verifyAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/attendance/corrections
 * Query: status=pending|approved|rejected (default: pending)
 * Returns all correction requests with employee info.
 */
export async function GET(req: Request) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'pending';

    const query: any = {};
    if (status !== 'all') query.status = status;

    const requests = await CorrectionRequest.find(query)
      .populate('employee', 'name employeeId designation department email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ requests });
  } catch (error: any) {
    console.error('Admin GET corrections error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
