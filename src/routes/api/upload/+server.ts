import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_DIR = 'static/uploads';
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

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true });
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

        // Generate unique filename
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
        const filePath = path.join(UPLOAD_DIR, uniqueName);

        // Write file
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filePath, buffer);

        // Return the public URL path
        uploadedUrls.push(`/uploads/${uniqueName}`);
    }

    return json({ urls: uploadedUrls });
};
