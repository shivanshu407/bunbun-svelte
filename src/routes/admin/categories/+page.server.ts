import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: {
            parent: { select: { name: true } },
            _count: { select: { products: true, children: true } }
        }
    });
    return { categories };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const fd = await request.formData();
        const name = fd.get('name') as string;
        const slug = fd.get('slug') as string;
        const description = fd.get('description') as string;
        const parentId = (fd.get('parentId') as string) || null;
        const image = (fd.get('image') as string) || null;

        if (!name || !slug) return fail(400, { error: 'Name and slug are required' });

        const existing = await prisma.category.findUnique({ where: { slug } });
        if (existing) return fail(400, { error: 'Slug already exists' });

        await prisma.category.create({
            data: { name, slug, description, parentId, image }
        });
        return { success: 'Category created!' };
    },

    delete: async ({ request }) => {
        const fd = await request.formData();
        const id = fd.get('id') as string;
        await prisma.category.delete({ where: { id } });
        return { success: 'Category deleted' };
    }
};
