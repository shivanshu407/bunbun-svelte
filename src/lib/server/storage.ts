import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

const BUCKET = 'bunbun-assets';

let client: ReturnType<typeof createClient> | undefined;

function getStorage() {
    if (!client) {
        const url = env.SUPABASE_URL || process.env.SUPABASE_URL;
        const key = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !key) {
            throw new Error(`Supabase credentials missing: url=${url ? 'SET' : 'MISSING'}, key=${key ? 'SET' : 'MISSING'}`);
        }

        client = createClient(url, key, {
            auth: { persistSession: false, autoRefreshToken: false }
        });
    }
    return client.storage.from(BUCKET);
}

/**
 * Upload a file to Supabase Storage.
 * @param file  Web File object from FormData
 * @param folder  Storage path prefix (e.g. "products", "banners")
 * @returns Public URL of the uploaded file
 */
export async function uploadFile(file: File, folder: string): Promise<string> {
    const storage = getStorage();

    // Generate a unique filename: folder/timestamp-randomhex.ext
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await storage.upload(filename, buffer, {
        contentType: file.type,
        upsert: false
    });

    if (error) {
        console.error('[Storage] Upload failed:', error.message);
        throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data } = storage.getPublicUrl(filename);
    return data.publicUrl;
}

/**
 * Upload from a base64 data URI (used by the general /api/upload endpoint).
 */
export async function uploadBase64(dataUri: string, folder: string, mimeType: string): Promise<string> {
    const storage = getStorage();

    const base64Data = dataUri.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    const ext = mimeType.split('/')[1] || 'jpg';
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await storage.upload(filename, buffer, {
        contentType: mimeType,
        upsert: false
    });

    if (error) {
        console.error('[Storage] Upload failed:', error.message);
        throw new Error(`Upload failed: ${error.message}`);
    }

    const { data } = storage.getPublicUrl(filename);
    return data.publicUrl;
}

export default getStorage;
