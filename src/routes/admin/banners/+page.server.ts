import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    const banners = await prisma.banner.findMany({ orderBy: { order: 'asc' } });
    return { banners };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const fd = await request.formData();
        const title = fd.get('title') as string;
        const subtitle = (fd.get('subtitle') as string) || null;
        const imageUrl = fd.get('imageUrl') as string;
        const linkUrl = (fd.get('linkUrl') as string) || null;
        const order = parseInt(fd.get('order') as string) || 0;

        if (!title || !imageUrl) return fail(400, { error: 'Title and image URL are required' });

        await prisma.banner.create({ data: { title, subtitle, imageUrl, linkUrl, order } });
        return { success: 'Banner created!' };
    },

    toggle: async ({ request }) => {
        const fd = await request.formData();
        const id = fd.get('id') as string;
        const banner = await prisma.banner.findUnique({ where: { id } });
        if (banner) await prisma.banner.update({ where: { id }, data: { isActive: !banner.isActive } });
    },

    delete: async ({ request }) => {
        const fd = await request.formData();
        const id = fd.get('id') as string;
        await prisma.banner.delete({ where: { id } });
        return { success: 'Banner deleted' };
    }
};
