<script lang="ts">
    import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-svelte";
    import {
        cartItems,
        cartTotal,
        cartItemCount,
        cartDrawerOpen,
    } from "$lib/stores/cart";
    import { formatPrice } from "$lib/utils";

    function close() {
        cartDrawerOpen.set(false);
    }
</script>

<!-- Cart Drawer -->
{#if $cartDrawerOpen}
    <div class="fixed inset-0 z-50">
        <!-- Backdrop -->
        <button
            class="absolute inset-0 bg-stone-900/50"
            onclick={close}
            aria-label="Close cart"
        ></button>

        <!-- Drawer -->
        <div
            class="absolute right-0 top-0 h-full w-[380px] max-w-[90vw] bg-white shadow-xl flex flex-col"
            style="animation: slideInRight 0.25s ease-out"
        >
            <!-- Header -->
            <div
                class="flex items-center justify-between px-5 py-4 border-b border-stone-200"
            >
                <h2
                    class="text-lg font-semibold font-[family-name:var(--font-heading)] flex items-center gap-2"
                >
                    <ShoppingBag size={20} />
                    Your Cart ({$cartItemCount})
                </h2>
                <button
                    onclick={close}
                    class="p-2 text-stone-500 hover:text-stone-700 transition-colors"
                    aria-label="Close cart"
                >
                    <X size={20} />
                </button>
            </div>

            <!-- Items -->
            <div class="flex-1 overflow-y-auto px-5 py-4">
                {#if $cartItemCount === 0}
                    <div
                        class="flex flex-col items-center justify-center h-full text-center"
                    >
                        <ShoppingBag size={48} class="text-stone-300 mb-4" />
                        <p class="text-stone-500 font-medium">
                            Your cart is empty
                        </p>
                        <p class="text-sm text-stone-400 mt-1">
                            Add items to get started
                        </p>
                        <a
                            href="/collections/sarees"
                            onclick={close}
                            class="mt-6 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-full transition-colors"
                        >
                            Start Shopping
                        </a>
                    </div>
                {:else}
                    <div class="space-y-4">
                        {#each $cartItems as item (item.id)}
                            <div class="flex gap-3 p-3 bg-stone-50 rounded-lg">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    class="w-20 h-20 object-cover rounded-md"
                                />
                                <div class="flex-1 min-w-0">
                                    <h4
                                        class="text-sm font-medium text-stone-800 truncate"
                                    >
                                        {item.name}
                                    </h4>
                                    {#if item.size || item.color}
                                        <p
                                            class="text-xs text-stone-400 mt-0.5"
                                        >
                                            {[item.size, item.color]
                                                .filter(Boolean)
                                                .join(" • ")}
                                        </p>
                                    {/if}
                                    <div
                                        class="flex items-center justify-between mt-2"
                                    >
                                        <div class="flex items-center gap-1">
                                            <button
                                                onclick={() =>
                                                    cartItems.updateQuantity(
                                                        item.productId,
                                                        item.variantId,
                                                        item.quantity - 1,
                                                    )}
                                                class="p-1 text-stone-500 hover:text-stone-700 transition-colors"
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span
                                                class="text-sm font-medium w-6 text-center"
                                                >{item.quantity}</span
                                            >
                                            <button
                                                onclick={() =>
                                                    cartItems.updateQuantity(
                                                        item.productId,
                                                        item.variantId,
                                                        item.quantity + 1,
                                                    )}
                                                class="p-1 text-stone-500 hover:text-stone-700 transition-colors"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span
                                                class="text-sm font-semibold text-stone-800"
                                            >
                                                {formatPrice(
                                                    (item.salePrice ??
                                                        item.price) *
                                                        item.quantity,
                                                )}
                                            </span>
                                            <button
                                                onclick={() =>
                                                    cartItems.removeItem(
                                                        item.productId,
                                                        item.variantId,
                                                    )}
                                                class="p-1 text-stone-400 hover:text-red-500 transition-colors"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>

            <!-- Footer -->
            {#if $cartItemCount > 0}
                <div class="border-t border-stone-200 px-5 py-4 space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-stone-600">Subtotal</span>
                        <span class="text-lg font-bold text-stone-900"
                            >{formatPrice($cartTotal)}</span
                        >
                    </div>
                    <p class="text-xs text-stone-400">
                        Shipping calculated at checkout
                    </p>
                    <div class="grid gap-2">
                        <a
                            href="/cart"
                            onclick={close}
                            class="block text-center py-2.5 border-2 border-stone-800 text-stone-800 text-sm font-medium rounded-full hover:bg-stone-800 hover:text-white transition-all"
                        >
                            View Cart
                        </a>
                        <a
                            href="/checkout"
                            onclick={close}
                            class="block text-center py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-full transition-colors"
                        >
                            Checkout Now
                        </a>
                    </div>
                </div>
            {/if}
        </div>
    </div>
{/if}
