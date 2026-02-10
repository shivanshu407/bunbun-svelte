import { writable, derived } from 'svelte/store';

export interface CartItemStore {
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
    const { subscribe, set, update } = writable<CartItemStore[]>([]);

    return {
        subscribe,
        addItem: (item: CartItemStore) => {
            update(items => {
                const existing = items.find(
                    i => i.productId === item.productId && i.variantId === item.variantId
                );
                if (existing) {
                    return items.map(i =>
                        i.productId === item.productId && i.variantId === item.variantId
                            ? { ...i, quantity: i.quantity + item.quantity }
                            : i
                    );
                }
                return [...items, item];
            });
        },
        removeItem: (productId: string, variantId: string) => {
            update(items => items.filter(i => !(i.productId === productId && i.variantId === variantId)));
        },
        updateQuantity: (productId: string, variantId: string, quantity: number) => {
            update(items =>
                items.map(i =>
                    i.productId === productId && i.variantId === variantId
                        ? { ...i, quantity: Math.max(1, quantity) }
                        : i
                )
            );
        },
        clear: () => set([]),
        set
    };
}

export const cartItems = createCartStore();

export const cartTotal = derived(cartItems, ($items) => {
    return $items.reduce((sum, item) => {
        const price = item.salePrice ?? item.price;
        return sum + price * item.quantity;
    }, 0);
});

export const cartItemCount = derived(cartItems, ($items) => {
    return $items.reduce((sum, item) => sum + item.quantity, 0);
});

export const cartDrawerOpen = writable(false);
