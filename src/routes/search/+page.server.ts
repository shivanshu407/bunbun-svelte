import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ url }) => {
    const q = url.searchParams.get('q') || '';
    if (!q) return { products: [], query: q };

    const products = await prisma.product.findMany({
        where: {
            isActive: true,
            OR: [
                { name: { contains: q } },
                { description: { contains: q } },
                { fabric: { contains: q } },
                { tags: { contains: q } }
            ]
        },
        include: { images: { take: 1, orderBy: { order: 'asc' } }, category: true },
        take: 24
    });

    return { products, query: q };
};
