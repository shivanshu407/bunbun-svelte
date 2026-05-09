import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { uploadFile } from '$lib/server/storage';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export const POST: RequestHandler = async ({ request, locals }) => {
    // Admin-only access
    if (!locals.user || locals.user.role !== 'admin') {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    let formData: FormData;
    try {
        formData = await request.formData();
    } catch (err: any) {
        return json({ error: `Failed to parse form data: ${err?.message}` }, { status: 400 });
    }

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
            const url = await uploadFile(file, 'products');
            uploadedUrls.push(url);
        } catch (error: any) {
            console.error("Upload Error:", error);
            return json(
                { error: 'Upload failed. Please try again.' },
                { status: 500 }
            );
        }
    }

    return json({ urls: uploadedUrls });
};
