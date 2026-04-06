import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { env } from '$env/dynamic/private';

const getConnectionConfig = () => {
    const host = env.MYSQL_HOST || 'localhost';
    const user = env.MYSQL_USER || '';
    const password = env.MYSQL_PASSWORD || '';
    const database = env.MYSQL_DATABASE || '';
    const port = parseInt(env.MYSQL_PORT || '3306');

    return { host, user, password, database, port, connectionLimit: 5, connectTimeout: 5000 };
};

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || (() => {
    const config = getConnectionConfig();
    const adapter = new PrismaMariaDb(config);
    return new PrismaClient({ adapter });
})();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
