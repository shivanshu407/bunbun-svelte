import { writable, derived, get } from 'svelte/store';

export interface CartItem {
    id: string;
    productId: string;
    variantId: string;
    name: string;
    image: string;
    size?: string;
    color?: string;
    price: number;
    salePrice?: number;
    quantity: number;
}

function createCartStore() {
    const { subscribe, set, update } = writable<CartItem[]>([]);

    return {
        subscribe,
        set,
        addItem: (item: CartItem) => {
            update(items => {
                const existing = items.find(i => i.id === item.id);
                if (existing) {
                    return items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
                }
                return [...items, item];
            });
        },
        removeItem: (id: string) => {
            update(items => items.filter(i => i.id !== id));
        },
        updateQuantity: (id: string, quantity: number) => {
            if (quantity <= 0) {
                update(items => items.filter(i => i.id !== id));
            } else {
                update(items => items.map(i => i.id === id ? { ...i, quantity } : i));
            }
        },
        clear: () => set([]),
        getItems: () => get({ subscribe })
    };
}

export const cartItems = createCartStore();
export const cartDrawerOpen = writable(false);

export const cartTotal = derived(cartItems, ($items) =>
    $items.reduce((sum, item) => sum + (item.salePrice ?? item.price) * item.quantity, 0)
);

export const cartCount = derived(cartItems, ($items) =>
    $items.reduce((sum, item) => sum + item.quantity, 0)
);
