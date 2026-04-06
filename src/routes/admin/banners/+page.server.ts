import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import cloudinary from '$lib/server/cloudinary';

export const load: PageServerLoad = async () => {
    try {
        const banners = await prisma.banner.findMany({ orderBy: { order: 'asc' } });
        return { banners };
    } catch {
        return { banners: [] };
    }
};

export const actions: Actions = {
    create: async ({ request }) => {
        const fd = await request.formData();
        const title = fd.get('title') as string;
        const subtitle = (fd.get('subtitle') as string) || null;
        const linkUrl = (fd.get('linkUrl') as string) || null;
        const linkText = (fd.get('linkText') as string) || null;
        const order = parseInt(fd.get('order') as string) || 0;
        const imageFile = fd.get('imageFile') as File | null;

        if (!title) return fail(400, { error: 'Title is required' });

        let imageUrl = '';

        // Upload image to Cloudinary
        if (imageFile && imageFile.size > 0) {
            try {
                const arrayBuffer = await imageFile.arrayBuffer();
                const base64 = Buffer.from(arrayBuffer).toString('base64');
                const dataUri = `data:${imageFile.type};base64,${base64}`;
                const result = await cloudinary.uploader.upload(dataUri, {
                    folder: 'bunbun_banners',
                    resource_type: 'image'
                });
                imageUrl = result.secure_url;
            } catch (e) {
                console.error('Cloudinary banner upload error:', e);
                return fail(500, { error: 'Failed to upload image. Check Cloudinary credentials.' });
            }
        } else {
            return fail(400, { error: 'Please upload a banner image' });
        }

        await prisma.banner.create({ data: { title, subtitle, imageUrl, linkUrl, linkText, order } });
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
