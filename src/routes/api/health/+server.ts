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
            MYSQL_HOST: env.MYSQL_HOST ? '***SET***' : '(not set)',
            MYSQL_DATABASE: env.MYSQL_DATABASE ? '***SET***' : '(not set)',
            DATABASE_URL: env.DATABASE_URL ? '***SET***' : '(not set)',
            CLOUDINARY_CLOUD_NAME: env.CLOUDINARY_CLOUD_NAME ? '***SET***' : '(not set)',
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
