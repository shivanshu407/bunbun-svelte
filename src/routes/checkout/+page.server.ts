import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { redirect, fail } from '@sveltejs/kit';
import { generateOrderNumber } from '$lib/utils';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) throw redirect(302, '/login?redirect=/checkout');

    const [addresses, cart] = await Promise.all([
        prisma.address.findMany({
            where: { userId: locals.user.id },
            orderBy: { isDefault: 'desc' }
        }),
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
        })
    ]);

    if (!cart?.items.length) throw redirect(302, '/cart');

    const subtotal = cart.items.reduce((sum, item) => {
        const price = item.variant.salePrice ?? item.variant.price;
        return sum + price * item.quantity;
    }, 0);

    return { addresses, cart, subtotal };
};

export const actions: Actions = {
    saveAddress: async ({ request, locals }) => {
        if (!locals.user) return fail(401, { error: 'Login required' });
        const fd = await request.formData();

        await prisma.address.create({
            data: {
                userId: locals.user.id,
                name: fd.get('name') as string,
                phone: fd.get('phone') as string,
                line1: fd.get('line1') as string,
                line2: (fd.get('line2') as string) || '',
                city: fd.get('city') as string,
                state: fd.get('state') as string,
                pincode: fd.get('pincode') as string,
                type: (fd.get('type') as string) || 'home',
                isDefault: fd.get('isDefault') === 'on'
            }
        });

        return { addressSaved: true };
    },

    placeOrder: async ({ request, locals }) => {
        if (!locals.user) return fail(401, { error: 'Login required' });
        const fd = await request.formData();
        const addressId = fd.get('addressId') as string;
        const paymentMethod = (fd.get('paymentMethod') as string) || 'cod';

        if (!addressId) return fail(400, { error: 'Please select a delivery address' });

        const address = await prisma.address.findUnique({ where: { id: addressId } });
        if (!address) return fail(400, { error: 'Invalid address' });

        const cart = await prisma.cart.findUnique({
            where: { userId: locals.user.id },
            include: {
                items: {
                    include: {
                        product: { include: { images: { take: 1, orderBy: { order: 'asc' } } } },
                        variant: true
                    }
                }
            }
        });

        if (!cart?.items.length) return fail(400, { error: 'Cart is empty' });

        const subtotal = cart.items.reduce((sum, item) => {
            const price = item.variant.salePrice ?? item.variant.price;
            return sum + price * item.quantity;
        }, 0);

        const shipping = subtotal >= 999 ? 0 : 79;
        const total = subtotal + shipping;

        // Create order in a transaction
        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    orderNumber: generateOrderNumber(),
                    userId: locals.user!.id,
                    subtotal,
                    shipping,
                    total,
                    status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
                    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
                    paymentMethod,
                    shippingAddress: JSON.stringify({
                        name: address.name,
                        phone: address.phone,
                        line1: address.line1,
                        line2: address.line2,
                        city: address.city,
                        state: address.state,
                        pincode: address.pincode
                    }),
                    items: {
                        create: cart.items.map((item) => ({
                            productId: item.productId,
                            variantId: item.variantId,
                            productName: item.product.name,
                            variantInfo: [item.variant.size, item.variant.color].filter(Boolean).join(' / '),
                            price: item.variant.salePrice ?? item.variant.price,
                            quantity: item.quantity,
                            total: (item.variant.salePrice ?? item.variant.price) * item.quantity,
                            image: item.product.images[0]?.url
                        }))
                    },
                    statusHistory: {
                        create: {
                            status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
                            notes: 'Order placed'
                        }
                    }
                }
            });

            // Decrease stock
            for (const item of cart.items) {
                await tx.productVariant.update({
                    where: { id: item.variantId },
                    data: { stock: { decrement: item.quantity } }
                });
            }

            // Clear cart
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

            return newOrder;
        });

        throw redirect(302, `/order-confirmation/${order.id}`);
    }
};
