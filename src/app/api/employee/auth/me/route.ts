import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Employee from '@/models/Employee';
import { verifyEmployee } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const payload = await verifyEmployee();
    if (!payload) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const employee = await Employee.findById(payload.id).select('-password');
    if (!employee) {
      return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json({ employee });
  } catch (error: any) {
    console.error('Employee me error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
