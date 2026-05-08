import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async () => {
    try {
        const [trending, bestsellers, newArrivals, banners, categories, homepageBlocks] = await Promise.all([
            prisma.product.findMany({
                where: { isActive: true, isTrending: true },
                include: { images: { take: 1, orderBy: { order: 'asc' } }, variants: { take: 1 } },
                take: 8,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.product.findMany({
                where: { isActive: true, isBestseller: true },
                include: { images: { take: 1, orderBy: { order: 'asc' } }, variants: { take: 1 } },
                take: 8,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.product.findMany({
                where: { isActive: true, isNewArrival: true },
                include: { images: { take: 1, orderBy: { order: 'asc' } }, variants: { take: 1 } },
                take: 8,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.banner.findMany({
                where: { isActive: true },
                orderBy: { order: 'asc' }
            }),
            prisma.category.findMany({
                where: { isActive: true, parentId: null },
                orderBy: { order: 'asc' },
                select: { id: true, name: true, slug: true, image: true }
            }),
            prisma.homepageBlock.findMany({
                where: { isActive: true },
                orderBy: { order: 'asc' }
            })
        ]);

        // If not enough flagged products, fill with any active products
        let featured = trending;
        if (featured.length < 4) {
            const extra = await prisma.product.findMany({
                where: { isActive: true, id: { notIn: featured.map(p => p.id) } },
                include: { images: { take: 1, orderBy: { order: 'asc' } }, variants: { take: 1 } },
                take: 8 - featured.length,
                orderBy: { createdAt: 'desc' }
            });
            featured = [...featured, ...extra];
        }

        let best = bestsellers;
        if (best.length < 4) {
            const extra = await prisma.product.findMany({
                where: { isActive: true, id: { notIn: [...featured.map(p => p.id), ...best.map(p => p.id)] } },
                include: { images: { take: 1, orderBy: { order: 'asc' } }, variants: { take: 1 } },
                take: 8 - best.length,
                orderBy: { createdAt: 'desc' }
            });
            best = [...best, ...extra];
        }

        // Group homepage blocks by section
        const blocks = {
            trendingBanner: homepageBlocks.filter(b => b.section === 'trending_banner'),
            storeGrid: homepageBlocks.filter(b => b.section === 'store_grid'),
            featuredCards: homepageBlocks.filter(b => b.section === 'featured_card'),
            bestsellerBanner: homepageBlocks.filter(b => b.section === 'bestseller_banner'),
            exclusiveBanner: homepageBlocks.filter(b => b.section === 'exclusive_banner'),
            paymentLogos: homepageBlocks.filter(b => b.section === 'payment_logo'),
        };

        return { trending: featured, bestsellers: best, newArrivals, banners, categories, blocks };
    } catch (error) {
        console.error('Homepage load error:', error);
        return { trending: [], bestsellers: [], newArrivals: [], banners: [], categories: [], blocks: { trendingBanner: [], storeGrid: [], featuredCards: [], bestsellerBanner: [], exclusiveBanner: [], paymentLogos: [] } };
    }
};
