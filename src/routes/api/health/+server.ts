import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { createConnection, createPool } from 'mariadb';
import { prisma } from '$lib/server/db';

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
        )
    ]);
}

export const GET: RequestHandler = async () => {
    const diagnostics: Record<string, any> = {
        timestamp: new Date().toISOString(),
        env: {
            MYSQL_HOST: env.MYSQL_HOST || '(not set)',
            MYSQL_DATABASE: env.MYSQL_DATABASE || '(not set)',
            DATABASE_URL: env.DATABASE_URL ? env.DATABASE_URL.replace(/:[^@]+@/, ':***@') : '(not set)',
        },
        directDbTest: 'pending',
        poolDbTest: 'pending',
        prismaTest: 'pending',
    };

    // Test direct mariadb connection
    let conn;
    try {
        conn = await createConnection({
            host: env.MYSQL_HOST || 'localhost',
            user: env.MYSQL_USER || '',
            password: env.MYSQL_PASSWORD || '',
            database: env.MYSQL_DATABASE || '',
            port: parseInt(env.MYSQL_PORT || '3306'),
            connectTimeout: 5000,
        });
        await conn.query('SELECT 1 as test');
        diagnostics.directDbTest = 'SUCCESS';
    } catch (error: any) {
        diagnostics.directDbTest = error.message;
    } finally {
        if (conn) await conn.end().catch(() => {});
    }

    // Test pool connection
    let pool;
    try {
        pool = createPool({
            host: env.MYSQL_HOST || 'localhost',
            user: env.MYSQL_USER || '',
            password: env.MYSQL_PASSWORD || '',
            database: env.MYSQL_DATABASE || '',
            port: parseInt(env.MYSQL_PORT || '3306'),
            connectionLimit: 5,
            connectTimeout: 5000,
        });
        const poolConn = await withTimeout(pool.getConnection(), 5000);
        await poolConn.query('SELECT 1 as poolTest');
        poolConn.release();
        diagnostics.poolDbTest = 'SUCCESS';
    } catch (error: any) {
        diagnostics.poolDbTest = error.message;
    } finally {
        if (pool) await pool.end().catch(() => {});
    }

    // Test Prisma connection
    try {
        await withTimeout(prisma.$queryRaw`SELECT 1 as test`, 5000);
        diagnostics.prismaTest = 'SUCCESS';
    } catch (error: any) {
        diagnostics.prismaTest = error.message;
    }

    return json(diagnostics, { status: 200 });
};
