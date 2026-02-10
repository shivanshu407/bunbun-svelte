import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const search = url.searchParams.get('search') ?? '';
    const perPage = 20;

    const where: any = {};
    if (search) {
        where.OR = [
            { name: { contains: search } },
            { slug: { contains: search } }
        ];
    }

    const [products, total, categories] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * perPage,
            take: perPage,
            include: {
                category: { select: { name: true } },
                images: { orderBy: { order: 'asc' }, take: 1 },
                _count: { select: { variants: true, reviews: true } }
            }
        }),
        prisma.product.count({ where }),
        prisma.category.findMany({ orderBy: { name: 'asc' } })
    ]);

    return {
        products,
        categories,
        pagination: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
        search
    };
};

export const actions: Actions = {
    delete: async ({ request }) => {
        const fd = await request.formData();
        const id = fd.get('id') as string;
        await prisma.product.delete({ where: { id } });
        return { success: 'Product deleted' };
    },

    toggleActive: async ({ request }) => {
        const fd = await request.formData();
        const id = fd.get('id') as string;
        const product = await prisma.product.findUnique({ where: { id } });
        if (product) {
            await prisma.product.update({ where: { id }, data: { isActive: !product.isActive } });
        }
    },

    toggleFeatured: async ({ request }) => {
        const fd = await request.formData();
        const id = fd.get('id') as string;
        const product = await prisma.product.findUnique({ where: { id } });
        if (product) {
            await prisma.product.update({ where: { id }, data: { isFeatured: !product.isFeatured } });
        }
    }
};
