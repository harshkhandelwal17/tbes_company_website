import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import connectDB from '@/lib/mongodb'
import Admin from '@/models/Admin'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  await connectDB()
  const { email, password } = await req.json()

  const admin = await Admin.findOne({ email })
  if (!admin) {
    return NextResponse.json({ message: 'Admin not found' }, { status: 401 })
  }

  const isMatch = await bcrypt.compare(password, admin.password)
  if (!isMatch) {
    return NextResponse.json({ message: 'Wrong password' }, { status: 401 })
  }

  (await cookies()).set('admin-auth', 'true', {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  })

  return NextResponse.json({ success: true })
}
