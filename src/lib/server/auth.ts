import { Lucia } from 'lucia';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { prisma } from './db.js';
import { dev } from '$app/environment';

const createLucia = () => {
	const adapter = new PrismaAdapter(prisma.session, prisma.user);

	return new Lucia(adapter, {
		sessionCookie: {
			attributes: {
				secure: !dev
			}
		},
		getUserAttributes: (attributes) => {
			return {
				email: attributes.email,
				name: attributes.name,
				role: attributes.role
			};
		}
	});
};

type LuciaInstance = ReturnType<typeof createLucia>;

let internalLucia: LuciaInstance | undefined;

function getLucia(): LuciaInstance {
	if (internalLucia) return internalLucia;
	internalLucia = createLucia();
	return internalLucia;
}

// Keep a stable export for existing imports, but defer DB access until actually needed.
export const lucia: LuciaInstance = new Proxy({} as LuciaInstance, {
	get(_target, prop) {
		const instance = getLucia();
		const value = (instance as any)[prop];
		return typeof value === 'function' ? value.bind(instance) : value;
	}
}) as LuciaInstance;

declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: {
            email: string;
            name: string;
            role: string;
        };
    }
}
