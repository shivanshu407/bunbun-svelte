import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';

// Add to wishlist
export const POST: RequestHandler = async ({ params, locals }) => {
    if (!locals.user) {
        return json({ error: 'Login required' }, { status: 401 });
    }

    let wishlist = await prisma.wishlist.findUnique({
        where: { userId: locals.user.id }
    });

    if (!wishlist) {
        wishlist = await prisma.wishlist.create({
            data: { userId: locals.user.id }
        });
    }

    // Check if already wishlisted
    const existing = await prisma.wishlistItem.findFirst({
        where: { wishlistId: wishlist.id, productId: params.productId }
    });

    if (!existing) {
        await prisma.wishlistItem.create({
            data: {
                wishlistId: wishlist.id,
                productId: params.productId
            }
        });
    }

    return json({ success: true });
};

// Remove from wishlist
export const DELETE: RequestHandler = async ({ params, locals }) => {
    if (!locals.user) {
        return json({ error: 'Login required' }, { status: 401 });
    }

    const wishlist = await prisma.wishlist.findUnique({
        where: { userId: locals.user.id }
    });

    if (wishlist) {
        await prisma.wishlistItem.deleteMany({
            where: { wishlistId: wishlist.id, productId: params.productId }
        });
    }

    return json({ success: true });
};
