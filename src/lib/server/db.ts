import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ['error']
    });

// Cache globally in all environments to prevent orphaned connections
globalForPrisma.prisma = prisma;
