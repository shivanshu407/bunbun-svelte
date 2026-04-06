import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { createConnection } from 'mariadb';

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
        directDbTest: 'pending',
    };

    // Test direct mariadb connection (bypassing Prisma entirely)
    let conn;
    try {
        conn = await createConnection({
            host: env.MYSQL_HOST || 'localhost',
            user: env.MYSQL_USER || '',
            password: env.MYSQL_PASSWORD || '',
            database: env.MYSQL_DATABASE || '',
            port: parseInt(env.MYSQL_PORT || '3306'),
            connectTimeout: 10000,
        });
        const rows = await conn.query('SELECT 1 as test');
        diagnostics.directDbTest = 'SUCCESS';
        diagnostics.directDbResult = rows;
    } catch (error: any) {
        diagnostics.directDbTest = 'FAILED';
        diagnostics.directDbError = {
            message: error?.message?.substring(0, 500) || String(error),
            code: error?.code,
            errno: error?.errno,
            sqlState: error?.sqlState,
        };
    } finally {
        if (conn) await conn.end().catch(() => {});
    }

    return json(diagnostics, { status: 200 });
};
