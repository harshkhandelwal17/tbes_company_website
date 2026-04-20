import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectDB from '@/lib/mongodb';
import Employee from '@/models/Employee';
import { cookies } from 'next/headers';
import { signEmployeeToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const employee = await Employee.findOne({ email: email.toLowerCase().trim() });
    if (!employee) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    if (employee.status !== 'active') {
      return NextResponse.json({ message: 'Your account has been deactivated. Contact admin.' }, { status: 403 });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signEmployeeToken({
      id: employee._id.toString(),
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email,
      role: employee.role,
    });

    const cookieStore = await cookies();
    cookieStore.set('employee-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 12, // 12 hours
      path: '/',
    });

    return NextResponse.json({
      success: true,
      employee: {
        id: employee._id,
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        designation: employee.designation,
        department: employee.department,
        role: employee.role,
      },
    });
  } catch (error: any) {
    console.error('Employee login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
