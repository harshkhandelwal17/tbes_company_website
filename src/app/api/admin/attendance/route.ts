import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import Employee from '@/models/Employee';
import { verifyAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/attendance
 * Query params:
 *   date=YYYY-MM-DD       → filter by specific date
 *   month=YYYY-MM         → filter by month
 *   employeeId=objectId   → filter by specific employee
 *   status=present|late|... → filter by status
 *
 * Returns attendance records with employee name populated.
 */
export async function GET(req: Request) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);

    const date = searchParams.get('date');
    const month = searchParams.get('month');
    const employeeId = searchParams.get('employeeId');
    const status = searchParams.get('status');

    const query: any = {};

    if (date) {
      query.date = date;
    } else if (month) {
      query.date = { $regex: `^${month}` };
    } else {
      // Default: today
      const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
      query.date = today;
    }

    if (employeeId) query.employee = employeeId;
    if (status && status !== 'all') query.status = status;

    const records = await Attendance.find(query)
      .populate('employee', 'name employeeId designation department email')
      .sort({ date: -1, createdAt: -1 });

    return NextResponse.json({ records });
  } catch (error: any) {
    console.error('Admin GET attendance error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/attendance — manually edit an attendance record
 * Body: { recordId, punchIn, punchOut, status, editReason }
 */
export async function PUT(req: Request) {
  try {
    const adminPayload = await verifyAdmin();
    if (!adminPayload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { recordId, punchIn, punchOut, status, editReason } = await req.json();

    if (!recordId) {
      return NextResponse.json({ message: 'recordId is required' }, { status: 400 });
    }

    const updateData: any = {
      isManuallyEdited: true,
      editedBy: (adminPayload as any).email || 'admin',
      editReason: editReason || '',
    };

    if (punchIn) updateData.punchIn = new Date(punchIn);
    if (punchOut) updateData.punchOut = new Date(punchOut);
    if (status) updateData.status = status;

    // Recalculate totalHours if both times given
    if (punchIn && punchOut) {
      const ms = new Date(punchOut).getTime() - new Date(punchIn).getTime();
      updateData.totalHours = Math.round((ms / (1000 * 60 * 60)) * 100) / 100;
    }

    const record = await Attendance.findByIdAndUpdate(recordId, updateData, { new: true })
      .populate('employee', 'name employeeId');

    if (!record) return NextResponse.json({ message: 'Record not found' }, { status: 404 });

    return NextResponse.json({ success: true, record });
  } catch (error: any) {
    console.error('Admin PUT attendance error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
