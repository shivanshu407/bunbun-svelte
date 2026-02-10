import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { redirect, fail } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) throw redirect(302, '/login?redirect=/account/profile');

    const user = await prisma.user.findUnique({
        where: { id: locals.user.id },
        select: { id: true, name: true, email: true, phone: true }
    });

    return { profile: user };
};

export const actions: Actions = {
    updateProfile: async ({ request, locals }) => {
        if (!locals.user) return fail(401, { error: 'Login required' });
        const fd = await request.formData();

        await prisma.user.update({
            where: { id: locals.user.id },
            data: {
                name: fd.get('name') as string,
                phone: (fd.get('phone') as string) || null
            }
        });

        return { success: 'Profile updated!' };
    },

    changePassword: async ({ request, locals }) => {
        if (!locals.user) return fail(401, { error: 'Login required' });
        const fd = await request.formData();
        const current = fd.get('currentPassword') as string;
        const newPass = fd.get('newPassword') as string;
        const confirm = fd.get('confirmPassword') as string;

        if (newPass !== confirm) return fail(400, { passwordError: 'Passwords do not match' });
        if (newPass.length < 6) return fail(400, { passwordError: 'Password must be at least 6 characters' });

        const user = await prisma.user.findUnique({ where: { id: locals.user.id } });
        if (!user) return fail(400, { passwordError: 'User not found' });

        const valid = await bcrypt.compare(current, user.passwordHash);
        if (!valid) return fail(400, { passwordError: 'Current password is incorrect' });

        const hash = await bcrypt.hash(newPass, 10);
        await prisma.user.update({ where: { id: locals.user.id }, data: { passwordHash: hash } });

        return { passwordSuccess: 'Password changed successfully!' };
    }
};
