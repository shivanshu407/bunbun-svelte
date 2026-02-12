import { writable } from "svelte/store";
import { browser } from "$app/environment";

export interface ViewedProduct {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    salePrice: number | null;
    rating: number;
    reviewCount: number;
    isTrending: boolean;
    isNewArrival: boolean;
    images: { url: string; alt: string | null }[];
}

const STORAGE_KEY = "bunbun_recently_viewed";

function createRecentlyViewedStore() {
    const { subscribe, set, update } = writable<ViewedProduct[]>([]);

    if (browser) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                set(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse recently viewed products", e);
            }
        }
    }

    return {
        subscribe,
        addProduct: (product: ViewedProduct) => {
            if (!browser) return;

            update((items) => {
                // Remove if already exists to move it to the top
                const filtered = items.filter((item) => item.id !== product.id);
                // Add to start
                const updated = [product, ...filtered].slice(0, 8); // Keep last 8

                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                return updated;
            });
        },
    };
}

export const recentlyViewed = createRecentlyViewedStore();
