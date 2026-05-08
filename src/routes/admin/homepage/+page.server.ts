import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import getCloudinary from '$lib/server/cloudinary';

const VALID_SECTIONS = [
    'trending_banner',
    'store_grid',
    'featured_card',
    'bestseller_banner',
    'exclusive_banner',
    'payment_logo'
] as const;

const SECTION_LABELS: Record<string, string> = {
    trending_banner: 'Trending Section Banner',
    store_grid: 'The BunBun Store Grid',
    featured_card: 'Featured Video/Card',
    bestseller_banner: 'Bestsellers Section Banner',
    exclusive_banner: 'Exclusive Collection Banner',
    payment_logo: 'Payment Method Logo'
};

export const load: PageServerLoad = async () => {
    const blocks = await prisma.homepageBlock.findMany({
        orderBy: [{ section: 'asc' }, { order: 'asc' }]
    });

    // Group by section
    const grouped: Record<string, typeof blocks> = {};
    for (const block of blocks) {
        if (!grouped[block.section]) grouped[block.section] = [];
        grouped[block.section].push(block);
    }

    return { blocks, grouped, sections: VALID_SECTIONS, sectionLabels: SECTION_LABELS };
};

export const actions: Actions = {
    create: async ({ request, locals }) => {
        if (!locals.user || locals.user.role !== 'admin') return fail(403, { error: 'Forbidden' });
        const fd = await request.formData();

        const section = fd.get('section') as string;
        const title = (fd.get('title') as string) || null;
        const subtitle = (fd.get('subtitle') as string) || null;
        const linkUrl = (fd.get('linkUrl') as string) || null;
        const linkText = (fd.get('linkText') as string) || null;
        const order = parseInt(fd.get('order') as string) || 0;
        const imageFile = fd.get('imageFile') as File | null;

        if (!section || !VALID_SECTIONS.includes(section as any)) {
            return fail(400, { error: 'Invalid section type' });
        }

        let imageUrl = '';

        if (imageFile && imageFile.size > 0) {
            try {
                const arrayBuffer = await imageFile.arrayBuffer();
                const base64 = Buffer.from(arrayBuffer).toString('base64');
                const dataUri = `data:${imageFile.type};base64,${base64}`;

                // Use video resource_type for featured_card videos
                const isVideo = imageFile.type.startsWith('video/');
                const result = await getCloudinary().uploader.upload(dataUri, {
                    folder: 'bunbun_homepage',
                    resource_type: isVideo ? 'video' : 'image'
                });
                imageUrl = result.secure_url;
            } catch (e) {
                console.error('Homepage block upload error:', e);
                return fail(500, { error: 'Failed to upload file. Check Cloudinary credentials.' });
            }
        } else {
            return fail(400, { error: 'Please upload an image or video' });
        }

        await prisma.homepageBlock.create({
            data: { section, title, subtitle, imageUrl, linkUrl, linkText, order }
        });

        return { success: 'Block created!' };
    },

    update: async ({ request, locals }) => {
        if (!locals.user || locals.user.role !== 'admin') return fail(403, { error: 'Forbidden' });
        const fd = await request.formData();
        const id = fd.get('id') as string;
        const title = (fd.get('title') as string) || null;
        const subtitle = (fd.get('subtitle') as string) || null;
        const linkUrl = (fd.get('linkUrl') as string) || null;
        const linkText = (fd.get('linkText') as string) || null;
        const order = parseInt(fd.get('order') as string) || 0;

        const data: any = { title, subtitle, linkUrl, linkText, order };

        // Optional new image upload
        const imageFile = fd.get('imageFile') as File | null;
        if (imageFile && imageFile.size > 0) {
            try {
                const arrayBuffer = await imageFile.arrayBuffer();
                const base64 = Buffer.from(arrayBuffer).toString('base64');
                const dataUri = `data:${imageFile.type};base64,${base64}`;
                const isVideo = imageFile.type.startsWith('video/');
                const result = await getCloudinary().uploader.upload(dataUri, {
                    folder: 'bunbun_homepage',
                    resource_type: isVideo ? 'video' : 'image'
                });
                data.imageUrl = result.secure_url;
            } catch (e) {
                console.error('Homepage block update upload error:', e);
                return fail(500, { error: 'Failed to upload file.' });
            }
        }

        await prisma.homepageBlock.update({ where: { id }, data });
        return { success: 'Block updated!' };
    },

    toggle: async ({ request, locals }) => {
        if (!locals.user || locals.user.role !== 'admin') return fail(403, { error: 'Forbidden' });
        const fd = await request.formData();
        const id = fd.get('id') as string;
        const block = await prisma.homepageBlock.findUnique({ where: { id } });
        if (block) {
            await prisma.homepageBlock.update({ where: { id }, data: { isActive: !block.isActive } });
        }
    },

    delete: async ({ request, locals }) => {
        if (!locals.user || locals.user.role !== 'admin') return fail(403, { error: 'Forbidden' });
        const fd = await request.formData();
        const id = fd.get('id') as string;
        await prisma.homepageBlock.delete({ where: { id } });
        return { success: 'Block deleted' };
    }
};
