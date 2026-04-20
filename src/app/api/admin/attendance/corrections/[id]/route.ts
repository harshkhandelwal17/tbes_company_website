import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CorrectionRequest from '@/models/CorrectionRequest';
import Attendance from '@/models/Attendance';
import { verifyAdmin } from '@/lib/auth';

function calcHours(punchIn: Date, punchOut: Date): number {
  const ms = punchOut.getTime() - punchIn.getTime();
  return Math.round((ms / (1000 * 60 * 60)) * 100) / 100;
}

function deriveStatus(totalHours: number, isLate: boolean): string {
  if (totalHours < 4) return 'half_day';
  return isLate ? 'late' : 'present';
}

/**
 * PUT /api/admin/attendance/corrections/[id]
 * Body: { action: 'approve' | 'reject', adminRemarks?: string }
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminPayload = await verifyAdmin();
    if (!adminPayload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { id } = await params;
    const { action, adminRemarks } = await req.json();

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ message: 'action must be "approve" or "reject"' }, { status: 400 });
    }

    const correctionReq = await CorrectionRequest.findById(id).populate('employee');
    if (!correctionReq) {
      return NextResponse.json({ message: 'Correction request not found' }, { status: 404 });
    }

    if (correctionReq.status !== 'pending') {
      return NextResponse.json(
        { message: `This request has already been ${correctionReq.status}.` },
        { status: 409 }
      );
    }

    const adminEmail = (adminPayload as any).email || 'admin';

    if (action === 'reject') {
      correctionReq.status = 'rejected';
      correctionReq.reviewedBy = adminEmail;
      correctionReq.reviewedAt = new Date();
      correctionReq.adminRemarks = adminRemarks || '';
      await correctionReq.save();

      return NextResponse.json({ success: true, message: 'Request rejected.', correctionReq });
    }

    // ── APPROVE ──────────────────────────────────────────────────
    const pIn = new Date(correctionReq.requestedPunchIn);
    const pOut = new Date(correctionReq.requestedPunchOut);
    const totalHours = calcHours(pIn, pOut);

    // Determine if late based on employee shift (default 9:15 AM = 9h 15m)
    const emp = correctionReq.employee as any;
    const gracePeriodMinutes =
      (emp.shiftStartHour ?? 9) * 60 + (emp.shiftStartMinute ?? 0) + (emp.graceMinutes ?? 15);
    const pInIST = new Date(pIn.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const pInMinutes = pInIST.getHours() * 60 + pInIST.getMinutes();
    const isLate = pInMinutes > gracePeriodMinutes;

    const finalStatus = deriveStatus(totalHours, isLate);

    // Upsert attendance for that date
    await Attendance.findOneAndUpdate(
      { employee: correctionReq.employee._id, date: correctionReq.date },
      {
        $set: {
          punchIn: pIn,
          punchOut: pOut,
          totalHours,
          status: finalStatus,
          isManuallyEdited: true,
          editedBy: adminEmail,
          editReason: `Correction request approved. Original reason: ${correctionReq.reason}`,
        },
      },
      { upsert: true, new: true }
    );

    // Mark correction request approved
    correctionReq.status = 'approved';
    correctionReq.reviewedBy = adminEmail;
    correctionReq.reviewedAt = new Date();
    correctionReq.adminRemarks = adminRemarks || '';
    await correctionReq.save();

    return NextResponse.json({
      success: true,
      message: 'Correction approved and attendance updated.',
      correctionReq,
    });
  } catch (error: any) {
    console.error('PUT correction review error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
