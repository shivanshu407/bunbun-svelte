import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import { prisma } from '$lib/server/db';
import bcrypt from 'bcryptjs';

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) {
        throw redirect(302, '/account');
    }
};

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = (formData.get('phone') as string) || null;
        const password = formData.get('password') as string;

        if (!name || !email || !password) {
            return fail(400, { error: 'All fields are required', name, email, phone });
        }

        if (password.length < 6) {
            return fail(400, { error: 'Password must be at least 6 characters', name, email, phone });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return fail(400, { error: 'An account with this email already exists', name, email, phone });
        }

        // Create user
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                passwordHash,
                role: 'customer'
            }
        });

        // Create session
        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies.set(sessionCookie.name, sessionCookie.value, {
            path: '.',
            ...sessionCookie.attributes
        });

        throw redirect(302, '/account');
    }
};
