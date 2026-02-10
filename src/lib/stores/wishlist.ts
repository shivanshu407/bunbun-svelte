import { writable, get } from 'svelte/store';

function createWishlistStore() {
    const { subscribe, set, update } = writable<Set<string>>(new Set());

    return {
        subscribe,
        /** Initialize from an array of product IDs (called once on layout mount) */
        init: (ids: string[]) => {
            set(new Set(ids));
        },
        /** Check if a product is wishlisted */
        has: (productId: string): boolean => {
            return get({ subscribe }).has(productId);
        },
        /** Toggle wishlist for a product; returns new wishlisted state */
        toggle: (productId: string): boolean => {
            let added = false;
            update(s => {
                const next = new Set(s);
                if (next.has(productId)) {
                    next.delete(productId);
                    added = false;
                } else {
                    next.add(productId);
                    added = true;
                }
                return next;
            });
            return added;
        },
        /** Add a product to wishlist */
        add: (productId: string) => {
            update(s => {
                const next = new Set(s);
                next.add(productId);
                return next;
            });
        },
        /** Remove a product from wishlist */
        remove: (productId: string) => {
            update(s => {
                const next = new Set(s);
                next.delete(productId);
                return next;
            });
        }
    };
}

export const wishlistIds = createWishlistStore();
