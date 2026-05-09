import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { prisma } from '$lib/server/db';

export const GET: RequestHandler = async ({ locals }) => {
    // H1 FIX: Only admins can see detailed diagnostics
    const isAdmin = locals.user?.role === 'admin';

    // Basic health check for public
    try {
        await prisma.$queryRaw`SELECT 1 as test`;
        if (!isAdmin) {
            return json({ status: 'ok', timestamp: new Date().toISOString() });
        }
    } catch (error: any) {
        if (!isAdmin) {
            return json({ status: 'error', timestamp: new Date().toISOString() }, { status: 503 });
        }
    }

    // Detailed diagnostics for admin only
    const diagnostics: Record<string, any> = {
        timestamp: new Date().toISOString(),
        env: {
            DATABASE_URL: env.DATABASE_URL ? '***SET***' : '(not set)',
            SUPABASE_URL: env.SUPABASE_URL ? '***SET***' : '(not set)',
            SUPABASE_SERVICE_ROLE_KEY: env.SUPABASE_SERVICE_ROLE_KEY ? '***SET***' : '(not set)',
        },
        prismaTest: 'pending',
    };

    try {
        await prisma.$queryRaw`SELECT 1 as test`;
        diagnostics.prismaTest = 'SUCCESS';
    } catch (error: any) {
        diagnostics.prismaTest = error.message;
    }

    return json(diagnostics, { status: 200 });
};
