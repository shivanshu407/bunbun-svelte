import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/db';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async () => {
    const diagnostics: Record<string, any> = {
        timestamp: new Date().toISOString(),
        env: {
            MYSQL_HOST: env.MYSQL_HOST || '(not set)',
            MYSQL_USER: env.MYSQL_USER || '(not set)',
            MYSQL_DATABASE: env.MYSQL_DATABASE || '(not set)',
            MYSQL_PORT: env.MYSQL_PORT || '(not set)',
            MYSQL_PASSWORD: env.MYSQL_PASSWORD ? '***SET***' : '(not set)',
            DATABASE_URL: env.DATABASE_URL ? env.DATABASE_URL.replace(/:[^@]+@/, ':***@') : '(not set)',
        },
        dbTest: 'pending'
    };

    try {
        // Try a simple query
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        diagnostics.dbTest = 'SUCCESS';
        diagnostics.dbResult = result;
    } catch (error: any) {
        diagnostics.dbTest = 'FAILED';
        diagnostics.dbError = {
            message: error?.message || String(error),
            code: error?.code,
            name: error?.name
        };
    }

    return json(diagnostics, { status: 200 });
};
