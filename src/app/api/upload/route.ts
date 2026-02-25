import { NextRequest, NextResponse } from 'next/server';
import { generatePresignedUploadUrl } from '@/lib/r2';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    try {
        // 1. Auth Check (Basic check for presence of admin-token)
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin-token');

        // For user-facing career page, we might allow resume uploads without admin-token
        // but the 'folder' should be restricted or validated.
        const { filename, contentType, folder } = await req.json();

        if (!filename || !contentType || !folder) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Security: Only allow specific folders for non-admins if needed
        if (!adminToken && folder !== 'tbes-resumes') {
            return NextResponse.json({ error: 'Unauthorized folder access' }, { status: 401 });
        }

        // 2. Generate unique key
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
        const key = `${folder}/${timestamp}-${random}-${sanitizedFilename}`;

        // 3. Generate presigned URL
        const presignedUrl = await generatePresignedUploadUrl(key, contentType);

        // 4. Construct the final public URL
        const publicBase = process.env.R2_PUBLIC_URL?.replace(/\/$/, '') || '';
        const publicUrl = `${publicBase}/${key}`;

        return NextResponse.json({
            presignedUrl,
            publicUrl,
            key
        });
    } catch (error: any) {
        console.error('[API Upload] Error:', error);
        return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
    }
}
