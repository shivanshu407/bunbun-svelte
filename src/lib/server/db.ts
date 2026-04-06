import { PrismaClient } from '@prisma/client';
import { env } from '$env/dynamic/private';

const getDatabaseUrl = () => {
    const host = env.MYSQL_HOST || 'localhost';
    const user = env.MYSQL_USER || '';
    const password = env.MYSQL_PASSWORD || '';
    const database = env.MYSQL_DATABASE || '';
    const port = env.MYSQL_PORT || '3306';
    
    // Construct Prisma URL directly
    return `mysql://${user}:${password}@${host}:${port}/${database}`;
};

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || (() => {
    return new PrismaClient({ 
        datasources: { 
            db: { 
                url: getDatabaseUrl() 
            } 
        } 
    });
})();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
