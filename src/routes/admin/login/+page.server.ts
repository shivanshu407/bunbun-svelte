import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import { prisma } from '$lib/server/db';
import bcrypt from 'bcryptjs';

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user?.role === 'admin') {
        throw redirect(302, '/admin');
    }
};

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            return fail(400, { error: 'Email and password are required', email });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.role !== 'admin') {
            return fail(400, { error: 'Invalid admin credentials', email });
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            return fail(400, { error: 'Invalid admin credentials', email });
        }

        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies.set(sessionCookie.name, sessionCookie.value, {
            path: '.',
            ...sessionCookie.attributes
        });

        throw redirect(302, '/admin');
    }
};
