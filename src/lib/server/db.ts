import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { env } from '$env/dynamic/private';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

let internalPrisma: PrismaClient | undefined;

type MariaDbConfig = {
	host: string;
	user: string;
	password: string;
	database: string;
	port: number;
};

function parseDatabaseUrl(databaseUrl: string): MariaDbConfig {
	let url: URL;
	try {
		url = new URL(databaseUrl);
	} catch {
		throw new Error('Invalid DATABASE_URL: must be a valid URL');
	}

	if (url.protocol !== 'mysql:' && url.protocol !== 'mariadb:') {
		throw new Error(`Invalid DATABASE_URL protocol: expected mysql:, got ${url.protocol}`);
	}

	const database = url.pathname.replace(/^\//, '');
	if (!database) {
		throw new Error('Invalid DATABASE_URL: missing database name in path');
	}

	return {
		host: url.hostname,
		// NOTE: URL.username / URL.password are already percent-decoded by the WHATWG URL parser.
		user: url.username,
		password: url.password,
		database,
		port: url.port ? Number(url.port) : 3306
	};
}

function getPrisma() {
    if (globalForPrisma.prisma) return globalForPrisma.prisma;
    if (internalPrisma) return internalPrisma;

    const databaseUrl = env.DATABASE_URL || process.env.DATABASE_URL;

    const mysqlHost = env.MYSQL_HOST || process.env.MYSQL_HOST;
    const mysqlUser = env.MYSQL_USER || process.env.MYSQL_USER;
    const mysqlPassword = env.MYSQL_PASSWORD || process.env.MYSQL_PASSWORD;
    const mysqlDatabase = env.MYSQL_DATABASE || process.env.MYSQL_DATABASE;
    const mysqlPortRaw = env.MYSQL_PORT || process.env.MYSQL_PORT;

    const baseConfig: MariaDbConfig =
        mysqlHost && mysqlUser && mysqlDatabase
            ? {
                host: mysqlHost,
                user: mysqlUser,
                password: mysqlPassword ?? '',
                database: mysqlDatabase,
                port: mysqlPortRaw ? Number(mysqlPortRaw) : 3306,
            }
            : databaseUrl
                ? parseDatabaseUrl(databaseUrl)
                : (() => {
                    throw new Error(
                        'Database is not configured. Set DATABASE_URL or (MYSQL_HOST, MYSQL_USER, MYSQL_DATABASE).'
                    );
                })();

    if (!Number.isFinite(baseConfig.port)) {
        throw new Error('Invalid database port: must be a number');
    }
    
    const config = {
        ...baseConfig,
        connectionLimit: 2, // Minimal limit to prevent Hostinger pool block
        connectTimeout: 5000,
        acquireTimeout: 5000,
    };

    const adapter = new PrismaMariaDb(config);
    internalPrisma = new PrismaClient({ adapter });
    
    // S6 FIX: Cache globally in all environments to prevent orphaned connections
    globalForPrisma.prisma = internalPrisma;
    
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
