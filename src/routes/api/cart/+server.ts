import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';

// Add to cart
export const POST: RequestHandler = async ({ request, locals }) => {
    const { productId, variantId, quantity } = await request.json();

    if (!productId || !variantId) {
        return json({ error: 'Product and variant are required' }, { status: 400 });
    }

    // Get or create cart
    let cart;
    if (locals.user) {
        cart = await prisma.cart.findUnique({ where: { userId: locals.user.id } });
        if (!cart) {
            cart = await prisma.cart.create({ data: { userId: locals.user.id } });
        }
    } else {
        // For guests, create anonymous cart
        cart = await prisma.cart.create({ data: {} });
    }

    // Check if item exists in cart
    const existingItem = await prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId, variantId }
    });

    if (existingItem) {
        await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + (quantity ?? 1) }
        });
    } else {
        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                variantId,
                quantity: quantity ?? 1
            }
        });
    }

    return json({ success: true });
};

// Get cart items
export const GET: RequestHandler = async ({ locals }) => {
    if (!locals.user) {
        return json({ items: [] });
    }

    const cart = await prisma.cart.findUnique({
        where: { userId: locals.user.id },
        include: {
            items: {
                include: {
                    product: { include: { images: { take: 1 } } },
                    variant: true
                }
            }
        }
    });

    return json({ items: cart?.items ?? [] });
};

// Clear cart
export const DELETE: RequestHandler = async ({ locals }) => {
    if (!locals.user) return json({ success: true });

    const cart = await prisma.cart.findUnique({ where: { userId: locals.user.id } });
    if (cart) {
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return json({ success: true });
};
