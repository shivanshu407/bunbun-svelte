import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) throw redirect(302, '/login?redirect=/account/orders');

    const orders = await prisma.order.findMany({
        where: { userId: locals.user.id },
        orderBy: { createdAt: 'desc' },
        include: {
            items: true,
            _count: { select: { items: true } }
        }
    });

    return { orders };
};
