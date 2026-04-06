import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { env } from '$env/dynamic/private';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

let internalPrisma: PrismaClient | undefined;

function getPrisma() {
    if (globalForPrisma.prisma) return globalForPrisma.prisma;
    if (internalPrisma) return internalPrisma;

    const host = env.MYSQL_HOST || process.env.MYSQL_HOST || 'localhost';
    const user = env.MYSQL_USER || process.env.MYSQL_USER || '';
    const password = env.MYSQL_PASSWORD || process.env.MYSQL_PASSWORD || '';
    const database = env.MYSQL_DATABASE || process.env.MYSQL_DATABASE || '';
    const port = parseInt(env.MYSQL_PORT || process.env.MYSQL_PORT || '3306');
    
    const config = {
        host, user, password, database, port,
        connectionLimit: 2, // Minimal limit to prevent Hostinger pool block
        connectTimeout: 5000,
    };

    const adapter = new PrismaMariaDb(config);
    internalPrisma = new PrismaClient({ adapter });
    
    if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = internalPrisma;
    }
    
    return internalPrisma;
}

// Proxy the requests to the lazily initialized Prisma client
export const prisma = new Proxy({} as PrismaClient, {
    get(target, prop) {
        const client = getPrisma();
        const value = (client as any)[prop];
        if (typeof value === 'function') {
            return value.bind(client);
        }
        return value;
    }
});
