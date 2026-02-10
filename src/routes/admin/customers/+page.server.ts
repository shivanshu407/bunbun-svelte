import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async () => {
    const customers = await prisma.user.findMany({
        where: { role: 'customer' },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: { select: { orders: true, reviews: true } }
        }
    });
    return { customers };
};
