import { writable } from 'svelte/store';

export interface UserStore {
    id: string;
    email: string;
    name: string;
    role: 'customer' | 'admin';
}

export const currentUser = writable<UserStore | null>(null);
