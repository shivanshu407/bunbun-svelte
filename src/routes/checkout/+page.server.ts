import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { redirect, fail } from '@sveltejs/kit';
import { generateOrderNumber } from '$lib/utils';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) throw redirect(302, '/login?redirect=/checkout');

    const [addresses, cart, coupons] = await Promise.all([
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

    if (!cart?.items.length) throw redirect(302, '/cart');

    const subtotal = cart.items.reduce((sum, item) => {
        const price = item.variant.salePrice ?? item.variant.price;
        return sum + price * item.quantity;
    }, 0);

    return { addresses, cart, subtotal, coupons };
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

    applyCoupon: async ({ request, locals }) => {
        if (!locals.user) return fail(401, { error: 'Login required' });
        const fd = await request.formData();
        const code = (fd.get('couponCode') as string).trim().toUpperCase();

        if (!code) return fail(400, { couponError: 'Please enter a coupon code' });

        const coupon = await prisma.coupon.findUnique({ where: { code } });

        if (!coupon || !coupon.isActive) {
            return fail(400, { couponError: 'Invalid or expired coupon code' });
        }

        const now = new Date();
        if (coupon.validFrom > now || coupon.validTo < now) {
            return fail(400, { couponError: 'This coupon has expired' });
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return fail(400, { couponError: 'This coupon has reached its usage limit' });
        }

        // Get cart subtotal
        const cart = await prisma.cart.findUnique({
            where: { userId: locals.user.id },
            include: { items: { include: { variant: true } } }
        });
        const subtotal = cart?.items.reduce((sum, item) => {
            return sum + (item.variant.salePrice ?? item.variant.price) * item.quantity;
        }, 0) ?? 0;

        if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
            return fail(400, { couponError: `Minimum order of ₹${coupon.minOrderAmount} required for this coupon` });
        }

        let discount = 0;
        if (coupon.type === 'percentage') {
            discount = Math.round(subtotal * coupon.value / 100);
            if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        } else {
            discount = coupon.value;
        }

        return {
            couponApplied: true,
            couponCode: coupon.code,
            couponDiscount: discount,
            couponType: coupon.type,
            couponValue: coupon.value
        };
    },

    placeOrder: async ({ request, locals }) => {
        if (!locals.user) return fail(401, { error: 'Login required' });
        const fd = await request.formData();
        const addressId = fd.get('addressId') as string;
        const paymentMethod = (fd.get('paymentMethod') as string) || 'cod';
        const couponCode = (fd.get('couponCode') as string) || null;

        if (!addressId) return fail(400, { error: 'Please select a delivery address' });

        // C3 FIX: Verify address belongs to current user
        const address = await prisma.address.findFirst({
            where: { id: addressId, userId: locals.user.id }
        });
        if (!address) return fail(400, { error: 'Invalid address' });

        // Validate payment method
        const validMethods = ['cod', 'razorpay'];
        if (!validMethods.includes(paymentMethod)) {
            return fail(400, { error: 'Invalid payment method' });
        }

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

        // C1 FIX: Server-side coupon discount recalculation — NEVER trust client
        let couponDiscount = 0;
        let validatedCouponCode: string | null = null;
        if (couponCode) {
            const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
            const now = new Date();
            if (coupon && coupon.isActive && coupon.validFrom <= now && coupon.validTo >= now) {
                if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
                    if (!coupon.minOrderAmount || subtotal >= coupon.minOrderAmount) {
                        if (coupon.type === 'percentage') {
                            couponDiscount = Math.round(subtotal * coupon.value / 100);
                            if (coupon.maxDiscount) couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
                        } else {
                            couponDiscount = coupon.value;
                        }
                        validatedCouponCode = coupon.code;
                    }
                }
            }
        }

        const shipping = subtotal >= 999 ? 0 : 79;
        const total = Math.max(subtotal + shipping - couponDiscount, 0);

        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    orderNumber: generateOrderNumber(),
                    userId: locals.user!.id,
                    subtotal,
                    shipping,
                    discount: couponDiscount,
                    couponCode: validatedCouponCode,
                    total: Math.max(total, 0),
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
                            notes: validatedCouponCode ? `Order placed with coupon ${validatedCouponCode}` : 'Order placed'
                        }
                    }
                }
            });

            // Increment coupon usage
            if (validatedCouponCode) {
                await tx.coupon.update({
                    where: { code: validatedCouponCode },
                    data: { usedCount: { increment: 1 } }
                });
            }

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
