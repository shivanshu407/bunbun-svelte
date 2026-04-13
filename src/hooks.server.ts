import type { Handle } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';

// H2 FIX: Simple in-memory rate limiter for auth endpoints
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_AUTH_ATTEMPTS = 10; // per window

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimits.get(ip);
    
    if (!entry || now > entry.resetAt) {
        rateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
        return false;
    }
    
    entry.count++;
    return entry.count > MAX_AUTH_ATTEMPTS;
}

// Clean up stale entries every 30 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, val] of rateLimits) {
        if (now > val.resetAt) rateLimits.delete(key);
    }
}, 30 * 60 * 1000);

export const handle: Handle = async ({ event, resolve }) => {
    // H2 FIX: Rate limit login/register endpoints
    const authPaths = ['/login', '/register', '/admin/login'];
    if (authPaths.includes(event.url.pathname) && event.request.method === 'POST') {
        const ip = event.getClientAddress();
        if (isRateLimited(ip)) {
            return new Response(JSON.stringify({ error: 'Too many attempts. Please try again later.' }), {
                status: 429,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }

    const sessionId = event.cookies.get(lucia.sessionCookieName);

    if (!sessionId) {
        event.locals.user = null;
        event.locals.session = null;
    } else {
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
    }

    const response = await resolve(event);

    // M3 FIX: Security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (event.url.protocol === 'https:') {
        response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    return response;
};
