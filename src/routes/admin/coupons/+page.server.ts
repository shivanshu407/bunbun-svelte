import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    const coupons = await prisma.coupon.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { orders: true } } }
    });
    return { coupons };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const fd = await request.formData();
        const code = (fd.get('code') as string)?.toUpperCase().trim();
        const description = fd.get('description') as string;
        const type = fd.get('type') as string;
        const value = parseFloat(fd.get('value') as string);
        const minOrderAmount = fd.get('minOrderAmount') ? parseFloat(fd.get('minOrderAmount') as string) : null;
        const maxDiscount = fd.get('maxDiscount') ? parseFloat(fd.get('maxDiscount') as string) : null;
        const usageLimit = fd.get('usageLimit') ? parseInt(fd.get('usageLimit') as string) : null;
        const validFrom = new Date(fd.get('validFrom') as string);
        const validTo = new Date(fd.get('validTo') as string);

        if (!code || !type || !value || !validFrom || !validTo) {
            return fail(400, { error: 'Required fields missing' });
        }

        const existing = await prisma.coupon.findUnique({ where: { code } });
        if (existing) return fail(400, { error: 'Coupon code already exists' });

        await prisma.coupon.create({
            data: { code, description, type, value, minOrderAmount, maxDiscount, usageLimit, validFrom, validTo }
        });

        return { success: 'Coupon created!' };
    },

    toggle: async ({ request }) => {
        const fd = await request.formData();
        const id = fd.get('id') as string;
        const coupon = await prisma.coupon.findUnique({ where: { id } });
        if (coupon) {
            await prisma.coupon.update({ where: { id }, data: { isActive: !coupon.isActive } });
        }
    },

    delete: async ({ request }) => {
        const fd = await request.formData();
        const id = fd.get('id') as string;
        await prisma.coupon.delete({ where: { id } });
        return { success: 'Coupon deleted' };
    }
};
