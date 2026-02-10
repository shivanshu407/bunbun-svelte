import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, url }) => {
    // Allow access to admin login page
    if (url.pathname === '/admin/login') {
        return { user: locals.user };
    }

    if (!locals.user || locals.user.role !== 'admin') {
        throw redirect(302, '/admin/login');
    }

    return { user: locals.user };
};
