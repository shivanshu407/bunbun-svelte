import type { RequestHandler } from './$types';
import { lucia } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals, cookies }) => {
    if (!locals.session) {
        throw redirect(302, '/login');
    }

    await lucia.invalidateSession(locals.session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies.set(sessionCookie.name, sessionCookie.value, {
        path: '.',
        ...sessionCookie.attributes
    });

    throw redirect(302, '/');
};
