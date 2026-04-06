import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ locals }) => {
    let wishlistProductIds: string[] = [];

    if (locals.user) {
        try {
            const wishlist = await prisma.wishlist.findUnique({
                where: { userId: locals.user.id },
                include: { items: { select: { productId: true } } }
            });
            if (wishlist) {
                wishlistProductIds = wishlist.items.map(i => i.productId);
            }
        } catch {
            // DB unreachable — degrade gracefully
        }
    }

    return {
        user: locals.user,
        wishlistProductIds
    };
};
