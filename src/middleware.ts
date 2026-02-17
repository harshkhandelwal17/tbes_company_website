import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // 1. Check if the request is for the admin panel
    if (pathname.startsWith('/admin')) {

        // 2. Exclude public admin routes (login page)
        if (pathname === '/admin/login') {
            return NextResponse.next()
        }

        // 3. Get the token from cookies
        const token = req.cookies.get('admin-token')?.value

        // 4. Verify the token
        const payload = token ? await verifyToken(token) : null

        // 5. If no token or invalid token, redirect to login
        if (!payload) {
            const loginUrl = new URL('/admin/login', req.url)
            // Optional: Add return URL for better UX
            loginUrl.searchParams.set('from', pathname)
            return NextResponse.redirect(loginUrl)
        }
    }

    // Allow all other requests
    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
