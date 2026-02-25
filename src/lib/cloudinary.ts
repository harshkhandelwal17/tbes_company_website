import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary once using server-side env vars
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file buffer or base64 string to Cloudinary.
 * @param fileBuffer - Buffer or base64 data URI
 * @param folder - Cloudinary folder name (e.g. 'tbes-projects', 'tbes-services')
 * @param resourceType - 'image' | 'raw' | 'video' | 'auto'
 * @returns { secure_url, public_id }
 */
export async function uploadToCloudinary(
    fileBuffer: Buffer,
    folder: string,
    resourceType: 'image' | 'raw' | 'video' | 'auto' = 'image'
): Promise<{ secure_url: string; public_id: string }> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder, resource_type: resourceType },
            (error, result) => {
                if (error || !result) {
                    reject(error || new Error('Cloudinary upload failed'));
                } else {
                    resolve({ secure_url: result.secure_url, public_id: result.public_id });
                }
            }
        );
        uploadStream.end(fileBuffer);
    });
}

/**
 * Delete a file from Cloudinary by its public_id.
 * Silently fails if the file does not exist.
 * @param publicId - Cloudinary public_id (e.g. 'tbes-projects/abc123')
 * @param resourceType - 'image' | 'raw' | 'video'
 */
export async function deleteFromCloudinary(
    publicId: string,
    resourceType: 'image' | 'raw' | 'video' = 'image'
): Promise<void> {
    if (!publicId) return;
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (err) {
        // Non-fatal: log but don't crash the delete operation
        console.error(`[Cloudinary] Failed to delete asset (${publicId}):`, err);
    }
}

/**
 * Extract Cloudinary public_id from a secure URL.
 * e.g. https://res.cloudinary.com/cloud/image/upload/v123/folder/filename.jpg
 * → folder/filename
 */
export function extractPublicId(url: string): string {
    if (!url || !url.includes('cloudinary.com')) return '';
    try {
        // Remove version and extension, keep folder/filename
        const parts = url.split('/upload/');
        if (parts.length < 2) return '';
        const afterUpload = parts[1]; // e.g. v1234567/tbes-projects/myfile.jpg
        const withoutVersion = afterUpload.replace(/^v\d+\//, ''); // remove v123/
        const withoutExt = withoutVersion.replace(/\.[^/.]+$/, ''); // remove .jpg
        return withoutExt;
    } catch {
        return '';
    }
}

export default cloudinary;
