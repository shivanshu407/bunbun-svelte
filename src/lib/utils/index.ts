import { randomBytes } from 'crypto';

export function formatPrice(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

export function calculateDiscount(original: number, sale: number): number {
    return Math.round(((original - sale) / original) * 100);
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.slice(0, length).trim() + '...';
}

// S2 FIX: Use crypto.randomBytes instead of Math.random for collision resistance
export function generateOrderNumber(): string {
    const prefix = 'BB';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = randomBytes(4).toString('hex').toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}

// S1 FIX: Shared address validation for checkout and account pages
export function validateAddress(fd: FormData): { error: string } | null {
    const name = (fd.get('name') as string)?.trim();
    const phone = (fd.get('phone') as string)?.trim();
    const line1 = (fd.get('line1') as string)?.trim();
    const city = (fd.get('city') as string)?.trim();
    const state = (fd.get('state') as string)?.trim();
    const pincode = (fd.get('pincode') as string)?.trim();

    if (!name || !phone || !line1 || !city || !state || !pincode) {
        return { error: 'Name, phone, address, city, state, and pincode are required' };
    }

    if (!/^\d{10}$/.test(phone)) {
        return { error: 'Phone must be a 10-digit number' };
    }

    if (!/^\d{6}$/.test(pincode)) {
        return { error: 'Pincode must be a 6-digit number' };
    }

    return null;
}

