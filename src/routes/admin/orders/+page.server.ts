import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const status = url.searchParams.get('status') ?? '';
    const perPage = 20;

    const where: any = {};
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * perPage,
            take: perPage,
            include: {
                user: { select: { name: true, email: true } },
                items: { include: { product: { select: { name: true } } } }
            }
        }),
        prisma.order.count({ where })
    ]);

    return {
        orders,
        pagination: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
        currentStatus: status
    };
};

export const actions: Actions = {
    updateStatus: async ({ request }) => {
        const fd = await request.formData();
        const id = fd.get('id') as string;
        const status = fd.get('status') as string;

        await prisma.order.update({ where: { id }, data: { status } });
        await prisma.orderStatusHistory.create({
            data: { orderId: id, status, notes: `Status updated to ${status}` }
        });

        return { success: `Order updated to ${status}` };
    }
};
