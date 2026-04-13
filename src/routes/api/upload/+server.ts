import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import getCloudinary from '$lib/server/cloudinary';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export const POST: RequestHandler = async ({ request, locals }) => {
    // Admin-only access
    if (!locals.user || locals.user.role !== 'admin') {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files.length) {
        return json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
        // Validate type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return json(
                { error: `Invalid file type: ${file.type}. Allowed: jpg, png, webp, avif` },
                { status: 400 }
            );
        }

        // Validate size
        if (file.size > MAX_FILE_SIZE) {
            return json(
                { error: `File ${file.name} exceeds 5MB limit` },
                { status: 400 }
            );
        }

        try {
            // Convert web File blob to base64 Data URI for secure Cloudinary transit
            const arrayBuffer = await file.arrayBuffer();
            const base64String = Buffer.from(arrayBuffer).toString('base64');
            const dataUri = `data:${file.type};base64,${base64String}`;

            // Upload directly to your safe Cloudinary bucket
            const uploadResult = await getCloudinary().uploader.upload(dataUri, {
                folder: 'bunbun_products',
                resource_type: 'image'
            });

            // Return the permanently hosted secure URL from Cloudinary
            uploadedUrls.push(uploadResult.secure_url);
        } catch (error: any) {
            console.error("Cloudinary Upload Error:", error);
            return json(
                { error: `Upload failed: ${error?.message || 'Unknown error'}. Check Cloudinary credentials.` },
                { status: 500 }
            );
        }
    }

    return json({ urls: uploadedUrls });
};
