import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
    });
    return { categories };
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        // H3 FIX: Verify admin at action level
        if (!locals.user || locals.user.role !== 'admin') {
            return fail(403, { error: 'Forbidden' });
        }

        const fd = await request.formData();
        const name = fd.get('name') as string;
        const slug = fd.get('slug') as string;
        const description = fd.get('description') as string;
        const shortDescription = (fd.get('shortDescription') as string) || null;
        const categoryId = fd.get('categoryId') as string;
        const basePrice = parseFloat(fd.get('basePrice') as string);
        const salePriceRaw = fd.get('salePrice') as string;
        const salePrice = salePriceRaw ? parseFloat(salePriceRaw) : null;
        const fabric = (fd.get('fabric') as string) || null;
        const careInstructions = (fd.get('careInstructions') as string) || null;
        const isFeatured = fd.get('isFeatured') === 'on';
        const isTrending = fd.get('isTrending') === 'on';
        const isNewArrival = fd.get('isNewArrival') === 'on';
        const isBestseller = fd.get('isBestseller') === 'on';

        if (!name || !slug || !description || !categoryId || isNaN(basePrice)) {
            return fail(400, { error: 'Please fill all required fields' });
        }

        // Check slug uniqueness
        const existing = await prisma.product.findUnique({ where: { slug } });
        if (existing) return fail(400, { error: 'Slug already exists. Choose a different one.' });

        // Parse image URLs (one per line)
        const imagesRaw = (fd.get('images') as string) || '';
        const imageUrls = imagesRaw.split('\n').map(s => s.trim()).filter(Boolean);

        // Parse variants (JSON array)
        const variantsRaw = (fd.get('variants') as string) || '[]';
        let variants: any[] = [];
        try {
            variants = JSON.parse(variantsRaw);
        } catch {
            return fail(400, { error: 'Invalid variants JSON format' });
        }

        await prisma.product.create({
            data: {
                name, slug, description, shortDescription,
                categoryId, basePrice, salePrice,
                fabric, careInstructions,
                isFeatured, isTrending, isNewArrival, isBestseller,
                images: {
                    create: imageUrls.map((url, i) => ({ url, alt: name, order: i }))
                },
                variants: {
                    create: variants.map((v: any) => ({
                        sku: v.sku,
                        size: v.size || null,
                        color: v.color || null,
                        colorHex: v.colorHex || null,
                        price: parseFloat(v.price) || basePrice,
                        salePrice: v.salePrice ? parseFloat(v.salePrice) : salePrice,
                        stock: parseInt(v.stock) || 0
                    }))
                }
            }
        });

        throw redirect(302, '/admin/products');
    }
};
