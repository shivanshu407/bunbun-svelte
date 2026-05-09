import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { uploadFile } from '$lib/server/storage';

export const load: PageServerLoad = async () => {
    try {
        const banners = await prisma.banner.findMany({ orderBy: { order: 'asc' } });
        return { banners };
    } catch {
        return { banners: [] };
    }
};

export const actions: Actions = {
    create: async ({ request, locals }) => {
        if (!locals.user || locals.user.role !== 'admin') return fail(403, { error: 'Forbidden' });
        const fd = await request.formData();
        const title = fd.get('title') as string;
        const subtitle = (fd.get('subtitle') as string) || null;
        const linkUrl = (fd.get('linkUrl') as string) || null;
        const linkText = (fd.get('linkText') as string) || null;
        const order = parseInt(fd.get('order') as string) || 0;
        const imageFile = fd.get('imageFile') as File | null;

        if (!title) return fail(400, { error: 'Title is required' });

        let imageUrl = '';

        if (imageFile && imageFile.size > 0) {
            try {
                imageUrl = await uploadFile(imageFile, 'banners');
            } catch (e) {
                console.error('Banner upload error:', e);
                return fail(500, { error: 'Failed to upload image.' });
            }
        } else {
            return fail(400, { error: 'Please upload a banner image' });
        }

        await prisma.banner.create({ data: { title, subtitle, imageUrl, linkUrl, linkText, order } });
        return { success: 'Banner created!' };
    },

    toggle: async ({ request, locals }) => {
        if (!locals.user || locals.user.role !== 'admin') return fail(403, { error: 'Forbidden' });
        const fd = await request.formData();
        const id = fd.get('id') as string;
        const banner = await prisma.banner.findUnique({ where: { id } });
        if (banner) await prisma.banner.update({ where: { id }, data: { isActive: !banner.isActive } });
    },

    delete: async ({ request, locals }) => {
        if (!locals.user || locals.user.role !== 'admin') return fail(403, { error: 'Forbidden' });
        const fd = await request.formData();
        const id = fd.get('id') as string;
        await prisma.banner.delete({ where: { id } });
        return { success: 'Banner deleted' };
    }
};
