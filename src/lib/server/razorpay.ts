import Razorpay from 'razorpay';
import { env } from '$env/dynamic/private';

let instance: Razorpay | undefined;

export function getRazorpay(): Razorpay {
    if (!instance) {
        const key_id = env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
        const key_secret = env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET;

        if (!key_id || !key_secret) {
            throw new Error(`Razorpay credentials missing: key_id=${key_id ? 'SET' : 'MISSING'}, key_secret=${key_secret ? 'SET' : 'MISSING'}`);
        }

        instance = new Razorpay({ key_id, key_secret });
    }
    return instance;
}
