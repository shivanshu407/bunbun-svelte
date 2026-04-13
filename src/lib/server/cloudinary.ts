import { v2 as cloudinary } from 'cloudinary';
import { env } from '$env/dynamic/private';

let configured = false;

function getCloudinary() {
    if (!configured) {
        const cloud_name = env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
        const api_key = env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY;
        const api_secret = env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET;

        if (!cloud_name || !api_key || !api_secret) {
            throw new Error(`Cloudinary credentials missing: cloud_name=${cloud_name ? 'SET' : 'MISSING'}, api_key=${api_key ? 'SET' : 'MISSING'}, api_secret=${api_secret ? 'SET' : 'MISSING'}`);
        }

        cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
        configured = true;
    }
    return cloudinary;
}

export default getCloudinary;
