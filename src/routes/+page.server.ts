import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async () => {
    try {
        const [trending, bestsellers, newArrivals] = await Promise.all([
            prisma.product.findMany({
                where: { isActive: true, isTrending: true },
                include: { images: { take: 1, orderBy: { order: 'asc' } }, variants: { take: 1 } },
                take: 4,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.product.findMany({
                where: { isActive: true, isBestseller: true },
                include: { images: { take: 1, orderBy: { order: 'asc' } }, variants: { take: 1 } },
                take: 4,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.product.findMany({
                where: { isActive: true, isNewArrival: true },
                include: { images: { take: 1, orderBy: { order: 'asc' } }, variants: { take: 1 } },
                take: 4,
                orderBy: { createdAt: 'desc' }
            }),
        ]);

        // If not enough flagged products, fill with any active products
        let featured = trending;
        if (featured.length < 4) {
            const extra = await prisma.product.findMany({
                where: { isActive: true, id: { notIn: featured.map(p => p.id) } },
                include: { images: { take: 1, orderBy: { order: 'asc' } }, variants: { take: 1 } },
                take: 4 - featured.length,
                orderBy: { createdAt: 'desc' }
            });
            featured = [...featured, ...extra];
        }

        let best = bestsellers;
        if (best.length < 4) {
            const extra = await prisma.product.findMany({
                where: { isActive: true, id: { notIn: [...featured.map(p => p.id), ...best.map(p => p.id)] } },
                include: { images: { take: 1, orderBy: { order: 'asc' } }, variants: { take: 1 } },
                take: 4 - best.length,
                orderBy: { createdAt: 'desc' }
            });
            best = [...best, ...extra];
        }

        return { trending: featured, bestsellers: best, newArrivals };
    } catch (error) {
        console.error('Homepage load error:', error);
        return { trending: [], bestsellers: [], newArrivals: [] };
    }
};
