import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import connectDB from '@/lib/mongodb'
import Admin from '@/models/Admin'
import { cookies } from 'next/headers'
import { signToken } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    await connectDB()
    const { email, password } = await req.json()

    const admin = await Admin.findOne({ email })
    if (!admin) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    // Generate JWT Token
    const token = await signToken({ id: admin._id, email: admin.email })

    // Set Secure Cookie
    const cookieStore = await cookies()
    cookieStore.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    })

    return NextResponse.json({ success: true, message: 'Login successful' })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
