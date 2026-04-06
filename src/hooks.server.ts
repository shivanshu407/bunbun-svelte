import type { Handle } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
    const sessionId = event.cookies.get(lucia.sessionCookieName);

    if (!sessionId) {
        event.locals.user = null;
        event.locals.session = null;
        return resolve(event);
    }

    try {
        const { session, user } = await lucia.validateSession(sessionId);

        if (session && session.fresh) {
            const sessionCookie = lucia.createSessionCookie(session.id);
            event.cookies.set(sessionCookie.name, sessionCookie.value, {
                path: '.',
                ...sessionCookie.attributes
            });
        }

        if (!session) {
            const sessionCookie = lucia.createBlankSessionCookie();
            event.cookies.set(sessionCookie.name, sessionCookie.value, {
                path: '.',
                ...sessionCookie.attributes
            });
        }

        event.locals.user = user
            ? {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role as 'customer' | 'admin'
            }
            : null;
        event.locals.session = session
            ? {
                id: session.id,
                expiresAt: session.expiresAt
            }
            : null;
    } catch (error) {
        console.error('Session validation error (DB may be unreachable):', error);
        event.locals.user = null;
        event.locals.session = null;
    }

    return resolve(event);
};
