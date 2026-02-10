import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user) throw redirect(302, '/login');

    const order = await prisma.order.findUnique({
        where: { id: params.id },
        include: {
            items: true,
            statusHistory: { orderBy: { changedAt: 'desc' } }
        }
    });

    if (!order || order.userId !== locals.user.id) throw redirect(302, '/account');

    return { order };
};
