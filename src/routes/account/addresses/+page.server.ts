import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) throw redirect(302, '/login?redirect=/account/addresses');

    const addresses = await prisma.address.findMany({
        where: { userId: locals.user.id },
        orderBy: { isDefault: 'desc' }
    });

    return { addresses };
};

export const actions: Actions = {
    add: async ({ request, locals }) => {
        if (!locals.user) return fail(401, { error: 'Login required' });
        const fd = await request.formData();

        await prisma.address.create({
            data: {
                userId: locals.user.id,
                name: fd.get('name') as string,
                phone: fd.get('phone') as string,
                line1: fd.get('line1') as string,
                line2: (fd.get('line2') as string) || '',
                city: fd.get('city') as string,
                state: fd.get('state') as string,
                pincode: fd.get('pincode') as string,
                type: (fd.get('type') as string) || 'home',
                isDefault: fd.get('isDefault') === 'on'
            }
        });
        return { success: 'Address added!' };
    },

    delete: async ({ request, locals }) => {
        if (!locals.user) return fail(401, { error: 'Login required' });
        const fd = await request.formData();
        const id = fd.get('id') as string;
        await prisma.address.delete({ where: { id, userId: locals.user.id } });
        return { success: 'Address deleted' };
    },

    setDefault: async ({ request, locals }) => {
        if (!locals.user) return fail(401, { error: 'Login required' });
        const fd = await request.formData();
        const id = fd.get('id') as string;

        await prisma.$transaction([
            prisma.address.updateMany({ where: { userId: locals.user.id }, data: { isDefault: false } }),
            prisma.address.update({ where: { id, userId: locals.user.id }, data: { isDefault: true } })
        ]);
        return { success: 'Default address updated' };
    }
};
