import { PrismaClient } from '@prisma/client';
import { env } from '$env/dynamic/private';

const constructUrl = () => {
    // If DATABASE_URL is already provided natively, use it
    if (env.DATABASE_URL) return env.DATABASE_URL;
    
    // Fallback designed exactly for Hostinger: Combining separated variables into Prisma URL format
    const host = env.MYSQL_HOST;
    const user = env.MYSQL_USER;
    const pass = encodeURIComponent(env.MYSQL_PASSWORD || '');
    const db = env.MYSQL_DATABASE;
    const port = env.MYSQL_PORT || '3306';
    
    return `mysql://${user}:${pass}@${host}:${port}/${db}?connect_timeout=5&socket_timeout=5`;
};

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
    datasources: {
        db: {
            url: constructUrl()
        }
    }
});

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
