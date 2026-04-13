import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';

// Add to cart
export const POST: RequestHandler = async ({ request, locals }) => {
    const { productId, variantId, quantity } = await request.json();

    if (!productId || !variantId) {
        return json({ error: 'Product and variant are required' }, { status: 400 });
    }

    // M4 FIX: Require authentication — no anonymous cart creation
    if (!locals.user) {
        return json({ error: 'Please login to add items to cart' }, { status: 401 });
    }

    // Get or create cart for authenticated user
    let cart = await prisma.cart.findUnique({ where: { userId: locals.user.id } });
    if (!cart) {
        cart = await prisma.cart.create({ data: { userId: locals.user.id } });
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

// Update cart item quantity
export const PATCH: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) return json({ error: 'Login required' }, { status: 401 });

    const { itemId, quantity } = await request.json();
    if (!itemId) return json({ error: 'Item ID required' }, { status: 400 });

    // C2 FIX: Verify cart item belongs to the current user
    const item = await prisma.cartItem.findUnique({
        where: { id: itemId },
        include: { cart: true }
    });
    if (!item || item.cart.userId !== locals.user.id) {
        return json({ error: 'Item not found' }, { status: 404 });
    }

    if (quantity <= 0) {
        await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
        await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity }
        });
    }

    return json({ success: true });
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
