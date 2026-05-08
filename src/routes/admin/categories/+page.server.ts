import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import getCloudinary from '$lib/server/cloudinary';

export const load: PageServerLoad = async () => {
    const categories = await prisma.category.findMany({
        orderBy: { order: 'asc' },
        include: {
            parent: { select: { name: true } },
            _count: { select: { products: true, children: true } }
        }
    });
    return { categories };
};

async function uploadImage(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;
    const result = await getCloudinary().uploader.upload(dataUri, {
        folder: 'bunbun_categories',
        resource_type: 'image'
    });
    return result.secure_url;
}

export const actions: Actions = {
    create: async ({ request, locals }) => {
        if (!locals.user || locals.user.role !== 'admin') return fail(403, { error: 'Forbidden' });
        const fd = await request.formData();
        const name = fd.get('name') as string;
        const slug = fd.get('slug') as string;
        const description = (fd.get('description') as string) || null;
        const parentId = (fd.get('parentId') as string) || null;
        const order = parseInt(fd.get('order') as string) || 0;
        const imageFile = fd.get('imageFile') as File | null;

        if (!name || !slug) return fail(400, { error: 'Name and slug are required' });

        const existing = await prisma.category.findUnique({ where: { slug } });
        if (existing) return fail(400, { error: 'Slug already exists' });

        let image: string | null = null;
        if (imageFile && imageFile.size > 0) {
            try {
                image = await uploadImage(imageFile);
            } catch (e) {
                console.error('Category image upload error:', e);
                return fail(500, { error: 'Failed to upload image.' });
            }
        }

        await prisma.category.create({
            data: { name, slug, description, parentId, image, order }
        });
        return { success: 'Category created!' };
    },

    update: async ({ request, locals }) => {
        if (!locals.user || locals.user.role !== 'admin') return fail(403, { error: 'Forbidden' });
        const fd = await request.formData();
        const id = fd.get('id') as string;
        const name = (fd.get('name') as string) || undefined;
        const description = (fd.get('description') as string) || null;
        const order = parseInt(fd.get('order') as string) || 0;
        const imageFile = fd.get('imageFile') as File | null;

        const data: any = { description, order };
        if (name) data.name = name;

        if (imageFile && imageFile.size > 0) {
            try {
                data.image = await uploadImage(imageFile);
            } catch (e) {
                console.error('Category image update error:', e);
                return fail(500, { error: 'Failed to upload image.' });
            }
        }

        await prisma.category.update({ where: { id }, data });
        return { success: 'Category updated!' };
    },

    delete: async ({ request, locals }) => {
        if (!locals.user || locals.user.role !== 'admin') return fail(403, { error: 'Forbidden' });
        const fd = await request.formData();
        const id = fd.get('id') as string;
        await prisma.category.delete({ where: { id } });
        return { success: 'Category deleted' };
    }
};
