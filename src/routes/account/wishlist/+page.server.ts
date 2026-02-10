import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) throw redirect(302, '/login');

    const wishlist = await prisma.wishlist.findUnique({
        where: { userId: locals.user.id },
        include: {
            items: {
                include: {
                    product: {
                        include: {
                            images: { orderBy: { order: 'asc' }, take: 1 },
                            category: { select: { name: true, slug: true } }
                        }
                    }
                },
                orderBy: { addedAt: 'desc' }
            }
        }
    });

    return { items: wishlist?.items ?? [] };
};
