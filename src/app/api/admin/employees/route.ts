import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectDB from '@/lib/mongodb';
import Employee from '@/models/Employee';
import { verifyAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// ─── Auto-generate employeeId like EMP001 ──────────────────────────────────
async function generateEmployeeId(): Promise<string> {
  const last = await Employee.findOne({}, { employeeId: 1 }).sort({ createdAt: -1 });
  if (!last) return 'EMP001';
  const num = parseInt(last.employeeId.replace('EMP', ''), 10);
  return `EMP${String(num + 1).padStart(3, '0')}`;
}

// GET — list all employees (with optional search & status filter)
export async function GET(req: Request) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const query: any = {};
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    const employees = await Employee.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    return NextResponse.json({ employees });
  } catch (error: any) {
    console.error('GET employees error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST — create new employee
export async function POST(req: Request) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const body = await req.json();
    const {
      name, email, password, phone,
      designation, department, joiningDate,
      role, shiftStartHour, shiftStartMinute, graceMinutes,
    } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email, and password are required.' }, { status: 400 });
    }

    // Check duplicate email
    const exists = await Employee.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return NextResponse.json({ message: 'An employee with this email already exists.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const employeeId = await generateEmployeeId();

    const employee = await Employee.create({
      employeeId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone?.trim() || '',
      designation: designation?.trim() || '',
      department: department?.trim() || '',
      joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
      role: role || 'employee',
      shiftStartHour: shiftStartHour ?? 9,
      shiftStartMinute: shiftStartMinute ?? 0,
      graceMinutes: graceMinutes ?? 15,
      status: 'active',
    });

    const { password: _, ...employeeData } = employee.toObject();
    return NextResponse.json({ success: true, employee: employeeData }, { status: 201 });
  } catch (error: any) {
    console.error('POST employee error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
