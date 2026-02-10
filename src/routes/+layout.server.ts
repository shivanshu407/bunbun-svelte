import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ locals }) => {
    let wishlistProductIds: string[] = [];

    if (locals.user) {
        const wishlist = await prisma.wishlist.findUnique({
            where: { userId: locals.user.id },
            include: { items: { select: { productId: true } } }
        });
        if (wishlist) {
            wishlistProductIds = wishlist.items.map(i => i.productId);
        }
    }

    return {
        user: locals.user,
        wishlistProductIds
    };
};
