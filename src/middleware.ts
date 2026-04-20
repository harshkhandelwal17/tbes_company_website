import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // ── ADMIN PANEL ───────────────────────────────────────────────
    if (pathname.startsWith('/admin')) {
        if (pathname === '/admin/login') return NextResponse.next()

        const token = req.cookies.get('admin-token')?.value
        const payload = token ? await verifyToken(token) : null

        if (!payload) {
            const loginUrl = new URL('/admin/login', req.url)
            loginUrl.searchParams.set('from', pathname)
            return NextResponse.redirect(loginUrl)
        }
    }

    // ── EMPLOYEE PANEL ────────────────────────────────────────────
    if (pathname.startsWith('/employee')) {
        if (pathname === '/employee/login') return NextResponse.next()

        const token = req.cookies.get('employee-token')?.value
        const payload = token ? await verifyToken(token) : null

        if (!payload) {
            const loginUrl = new URL('/employee/login', req.url)
            loginUrl.searchParams.set('from', pathname)
            return NextResponse.redirect(loginUrl)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/employee/:path*'],
}
