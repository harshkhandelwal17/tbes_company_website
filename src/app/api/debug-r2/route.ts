import { NextResponse } from 'next/server';

export async function GET() {
    const config = {
        R2_ACCOUNT_ID: !!process.env.R2_ACCOUNT_ID,
        R2_ACCESS_KEY_ID: !!process.env.R2_ACCESS_KEY_ID,
        R2_SECRET_ACCESS_KEY: !!process.env.R2_SECRET_ACCESS_KEY,
        R2_BUCKET_NAME: !!process.env.R2_BUCKET_NAME,
        R2_PUBLIC_URL: !!process.env.R2_PUBLIC_URL,
    };

    const allPresent = Object.values(config).every(v => v === true);

    return NextResponse.json({
        status: allPresent ? 'Configured' : 'Incomplete',
        message: allPresent
            ? 'All R2 environment variables are detected on the server.'
            : 'Some R2 environment variables are MISSING on the server.',
        checks: config,
        env: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
}
