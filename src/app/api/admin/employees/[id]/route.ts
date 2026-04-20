import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectDB from '@/lib/mongodb';
import Employee from '@/models/Employee';
import { verifyAdmin } from '@/lib/auth';

// GET — single employee
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { id } = await params;
    const employee = await Employee.findById(id).select('-password');
    if (!employee) return NextResponse.json({ message: 'Employee not found' }, { status: 404 });

    return NextResponse.json({ employee });
  } catch (error: any) {
    console.error('GET employee by id error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT — update employee details
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const {
      name, phone, designation, department, joiningDate,
      status, role, shiftStartHour, shiftStartMinute, graceMinutes,
      password, // optional — only update if provided
    } = body;

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (designation !== undefined) updateData.designation = designation.trim();
    if (department !== undefined) updateData.department = department.trim();
    if (joiningDate) updateData.joiningDate = new Date(joiningDate);
    if (status) updateData.status = status;
    if (role) updateData.role = role;
    if (shiftStartHour !== undefined) updateData.shiftStartHour = shiftStartHour;
    if (shiftStartMinute !== undefined) updateData.shiftStartMinute = shiftStartMinute;
    if (graceMinutes !== undefined) updateData.graceMinutes = graceMinutes;

    if (password && password.length >= 6) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const employee = await Employee.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    if (!employee) return NextResponse.json({ message: 'Employee not found' }, { status: 404 });

    return NextResponse.json({ success: true, employee });
  } catch (error: any) {
    console.error('PUT employee error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE — soft delete (set status to terminated)
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { id } = await params;
    const employee = await Employee.findByIdAndUpdate(
      id,
      { status: 'terminated' },
      { new: true }
    ).select('-password');

    if (!employee) return NextResponse.json({ message: 'Employee not found' }, { status: 404 });

    return NextResponse.json({ success: true, message: 'Employee terminated.', employee });
  } catch (error: any) {
    console.error('DELETE employee error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
