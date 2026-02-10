import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        return { cart: null, coupons: [] };
    }

    const [cart, coupons] = await Promise.all([
        prisma.cart.findUnique({
            where: { userId: locals.user.id },
            include: {
                items: {
                    include: {
                        product: { include: { images: { take: 1, orderBy: { order: 'asc' } } } },
                        variant: true
                    }
                }
            }
        }),
        prisma.coupon.findMany({
            where: {
                isActive: true,
                validFrom: { lte: new Date() },
                validTo: { gte: new Date() }
            },
            orderBy: { value: 'desc' }
        })
    ]);

    const subtotal = cart?.items.reduce((sum, item) => {
        const price = item.variant.salePrice ?? item.variant.price;
        return sum + price * item.quantity;
    }, 0) ?? 0;

    return { cart, subtotal, coupons };
};
