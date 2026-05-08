import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ locals }) => {
    let wishlistProductIds: string[] = [];
    let categories: { id: string; name: string; slug: string; image: string | null }[] = [];

    try {
        // Load categories for nav/footer (always needed)
        categories = await prisma.category.findMany({
            where: { isActive: true, parentId: null },
            orderBy: { order: 'asc' },
            select: { id: true, name: true, slug: true, image: true }
        });
    } catch {
        // DB unreachable — degrade gracefully
    }

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
        wishlistProductIds,
        categories
    };
};
