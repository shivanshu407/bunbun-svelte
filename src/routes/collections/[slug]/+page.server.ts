import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, url }) => {
    const { slug } = params;
    const sort = url.searchParams.get('sort') ?? 'newest';
    const fabric = url.searchParams.get('fabric');
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const perPage = 12;

    // Fetch category
    const category = await prisma.category.findUnique({
        where: { slug }
    });

    if (!category) {
        throw error(404, 'Category not found');
    }

    // Build where clause
    const where: any = {
        categoryId: category.id,
        isActive: true
    };

    if (fabric) {
        where.fabric = fabric;
    }
    if (minPrice || maxPrice) {
        where.basePrice = {};
        if (minPrice) where.basePrice.gte = parseFloat(minPrice);
        if (maxPrice) where.basePrice.lte = parseFloat(maxPrice);
    }

    // Sort
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-low') orderBy = { basePrice: 'asc' };
    else if (sort === 'price-high') orderBy = { basePrice: 'desc' };
    else if (sort === 'popular') orderBy = { reviewCount: 'desc' };
    else if (sort === 'rating') orderBy = { rating: 'desc' };

    const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy,
            skip: (page - 1) * perPage,
            take: perPage,
            include: {
                images: { orderBy: { order: 'asc' }, take: 2 }
            }
        }),
        prisma.product.count({ where })
    ]);

    // Fetch active coupons for display
    const coupons = await prisma.coupon.findMany({
        where: {
            isActive: true,
            validFrom: { lte: new Date() },
            validTo: { gte: new Date() }
        },
        take: 3
    });

    return {
        category,
        products,
        coupons,
        pagination: {
            page,
            perPage,
            totalCount,
            totalPages: Math.ceil(totalCount / perPage)
        },
        filters: { sort, fabric, minPrice, maxPrice }
    };
};
