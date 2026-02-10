import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    const orders = await prisma.order.findMany({
        where: { userId: locals.user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { items: true }
    });

    return {
        user: locals.user,
        recentOrders: orders
    };
};
