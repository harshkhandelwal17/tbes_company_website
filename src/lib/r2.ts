import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Cloudflare R2 Client Configuration
const r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${(process.env.R2_ACCOUNT_ID || "").trim()}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: (process.env.R2_ACCESS_KEY_ID || "").trim(),
        secretAccessKey: (process.env.R2_SECRET_ACCESS_KEY || "").trim(),
    },
    // R2 works best with path-style access for current SDK versions on the account endpoint
    forcePathStyle: true,
    // CRITICAL: Prevent SDK from automatically calculating and signing checksums.
    // This is the root cause of the 403 Forbidden error in browser uploads.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
});

// Diagnostic check (Server-side logs only)
if (typeof window === 'undefined') {
    const bucket = (process.env.R2_BUCKET_NAME || "").trim();
    if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !bucket) {
        console.error("[R2 CONFIG ERROR] One or more R2 environment variables are MISSING.");
    } else {
        console.log(`[R2 CONFIG] Initialized for bucket: ${bucket}`);
    }
}

/**
 * Generate a presigned URL for uploading a file directly to R2 from the browser.
 */
export async function generatePresignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn = 3600
): Promise<string> {
    const command = new PutObjectCommand({
        Bucket: (process.env.R2_BUCKET_NAME || "").trim(),
        Key: key,
    });

    // Disable checksumming for this specific command as well.
    (command.input as any).ChecksumAlgorithm = undefined;

    return await getSignedUrl(r2Client, command, {
        expiresIn,
        // Only sign the host to prevent browser-specific headers from breaking the signature.
        signableHeaders: new Set(["host"]),
    });
}

/**
 * Upload a file buffer directly to R2 from the server.
 */
export async function uploadToR2(
    buffer: Buffer | Uint8Array,
    key: string,
    contentType: string
): Promise<string> {
    try {
        const command = new PutObjectCommand({
            Bucket: (process.env.R2_BUCKET_NAME || "").trim(),
            Key: key,
            Body: buffer,
            ContentType: contentType,
        });

        // Disable checksums here too
        (command.input as any).ChecksumAlgorithm = undefined;

        await r2Client.send(command);
        const publicBase = (process.env.R2_PUBLIC_URL || "").trim().replace(/\/$/, "");
        return `${publicBase}/${key}`;
    } catch (error: any) {
        if (error.name === "AccessDenied") {
            console.error("\n[R2 FATAL] Access Denied. Please check your R2 API Token permissions.");
            console.error("1. Ensure the token has 'Object Read & Write' permission.");
            console.error("2. Ensure the token is restricted to the correct bucket or has 'All Buckets' access.\n");
        }
        throw error;
    }
}

/**
 * Delete an object from the R2 bucket.
 * @param key - The path/filename of the object to delete
 */
export async function deleteFromR2(key: string): Promise<void> {
    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
        });
        await r2Client.send(command);
    } catch (error) {
        console.error("[R2] Delete failed for key:", key, error);
        // Non-fatal, but logged
    }
}

/**
 * Extract the object key from an R2 public URL.
 * e.g., https://pub-xxxx.r2.dev/tbes-services/image.jpg -> tbes-services/image.jpg
 */
export function extractR2Key(url: string): string {
    if (!url) return "";
    const publicUrl = (process.env.R2_PUBLIC_URL || "").trim();

    // If it's not an R2 URL, return empty
    if (!publicUrl || !url.includes(publicUrl)) {
        return "";
    }

    try {
        // Handle cases where the URL might have query params
        const urlObj = new URL(url);
        let key = urlObj.pathname;

        // Remove public URL path prefix if present (e.g. if R2_PUBLIC_URL has a path)
        const publicPath = new URL(publicUrl).pathname;
        if (publicPath !== "/" && key.startsWith(publicPath)) {
            key = key.slice(publicPath.length);
        }

        // Remove leading slash
        return key.startsWith("/") ? key.slice(1) : key;
    } catch {
        // Fallback for non-standard URLs
        const parts = url.split(publicUrl);
        if (parts.length > 1) {
            let key = parts[1];
            if (key.startsWith("/")) key = key.slice(1);
            // Remove query params if any
            return key.split("?")[0];
        }
        return "";
    }
}

export default r2Client;
