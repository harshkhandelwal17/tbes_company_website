import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
    throw new Error('JWT_SECRET environment variable is missing. Please set it in .env');
}

const key = new TextEncoder().encode(SECRET_KEY);

export async function signToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, key);
        return payload;
    } catch (error) {
        return null;
    }
}

/**
 * Helper to verify admin status in API routes.
 * Returns the payload if valid, otherwise null.
 */
export async function verifyAdmin() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin-token')?.value;

        if (!token) return null;

        return await verifyToken(token);
    } catch (error) {
        return null;
    }
}
