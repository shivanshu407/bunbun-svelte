import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async () => {
    const [
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue,
        recentOrders,
        activeCoupons
    ] = await Promise.all([
        prisma.product.count({ where: { isActive: true } }),
        prisma.order.count(),
        prisma.user.count({ where: { role: 'customer' } }),
        prisma.order.aggregate({
            _sum: { total: true },
            where: { paymentStatus: 'paid' }
        }),
        prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { user: { select: { name: true, email: true } } }
        }),
        prisma.coupon.count({
            where: {
                isActive: true,
                validTo: { gte: new Date() }
            }
        })
    ]);

    return {
        stats: {
            totalProducts,
            totalOrders,
            totalCustomers,
            totalRevenue: totalRevenue._sum.total ?? 0,
            activeCoupons
        },
        recentOrders
    };
};
