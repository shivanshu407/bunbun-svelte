import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    const product = await prisma.product.findUnique({
        where: { slug: params.slug },
        include: {
            category: true,
            images: { orderBy: { order: 'asc' } },
            variants: { where: { isAvailable: true } },
            reviews: {
                where: { isApproved: true },
                orderBy: { createdAt: 'desc' },
                take: 10,
                include: { user: { select: { name: true } } }
            }
        }
    });

    if (!product || !product.isActive) {
        throw error(404, 'Product not found');
    }

    // Fetch active coupons
    const coupons = await prisma.coupon.findMany({
        where: {
            isActive: true,
            validFrom: { lte: new Date() },
            validTo: { gte: new Date() }
        },
        take: 3
    });

    // Related products
    const related = await prisma.product.findMany({
        where: {
            categoryId: product.categoryId,
            id: { not: product.id },
            isActive: true
        },
        include: { images: { orderBy: { order: 'asc' }, take: 1 } },
        take: 4
    });

    return { product, coupons, related };
};
