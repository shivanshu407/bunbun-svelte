<script lang="ts">
    import {
        Minus,
        Plus,
        Trash2,
        ShoppingBag,
        ArrowRight,
        Tag,
    } from "lucide-svelte";
    import { cartItems, cartTotal, cartCount } from "$lib/stores/cart";
    import { formatPrice } from "$lib/utils";

    let items = $state<any[]>([]);
    let total = $state(0);
    let count = $state(0);

    cartItems.subscribe((v) => (items = v));
    cartTotal.subscribe((v) => (total = v));
    cartCount.subscribe((v) => (count = v));

    function updateQty(id: string, qty: number) {
        cartItems.updateQuantity(id, qty);
    }

    function remove(id: string) {
        cartItems.removeItem(id);
    }

    function clearCart() {
        cartItems.clear();
        fetch("/api/cart", { method: "DELETE" });
    }
</script>

<svelte:head>
    <title>Shopping Cart | BunBunClothing</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-4 py-8 md:py-12">
    <h1
        class="text-2xl md:text-3xl font-semibold font-[family-name:var(--font-heading)] text-stone-900 mb-6"
    >
        Shopping Cart ({count}
        {count === 1 ? "item" : "items"})
    </h1>

    {#if items.length === 0}
        <div
            class="text-center py-20 bg-white rounded-2xl border border-stone-200"
        >
            <ShoppingBag size={48} class="mx-auto text-stone-300 mb-4" />
            <h2 class="text-lg font-semibold text-stone-800">
                Your cart is empty
            </h2>
            <p class="text-sm text-stone-500 mt-1">
                Looks like you haven't added anything yet
            </p>
            <a
                href="/collections/sarees"
                class="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
                Continue Shopping <ArrowRight size={18} />
            </a>
        </div>
    {:else}
        <div class="grid lg:grid-cols-3 gap-8">
            <!-- Cart Items -->
            <div class="lg:col-span-2 space-y-4">
                {#each items as item (item.id)}
                    <div
                        class="bg-white rounded-xl border border-stone-200 p-4 flex gap-4"
                    >
                        <!-- Image -->
                        <div
                            class="w-24 h-28 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0"
                        >
                            {#if item.image}
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    class="w-full h-full object-cover"
                                />
                            {:else}
                                <div
                                    class="w-full h-full flex items-center justify-center text-3xl"
                                >
                                    👗
                                </div>
                            {/if}
                        </div>

                        <div class="flex-1 min-w-0">
                            <h3
                                class="font-medium text-stone-800 text-sm truncate"
                            >
                                {item.name}
                            </h3>
                            {#if item.size || item.color}
                                <p class="text-xs text-stone-400 mt-0.5">
                                    {#if item.size}Size: {item.size}{/if}
                                    {#if item.size && item.color}
                                        •
                                    {/if}
                                    {#if item.color}Color: {item.color}{/if}
                                </p>
                            {/if}

                            <!-- Price -->
                            <div class="flex items-center gap-2 mt-2">
                                {#if item.salePrice}
                                    <span
                                        class="text-sm font-bold text-stone-900"
                                        >{formatPrice(item.salePrice)}</span
                                    >
                                    <span
                                        class="text-xs text-stone-400 line-through"
                                        >{formatPrice(item.price)}</span
                                    >
                                {:else}
                                    <span
                                        class="text-sm font-bold text-stone-900"
                                        >{formatPrice(item.price)}</span
                                    >
                                {/if}
                            </div>

                            <!-- Quantity + Remove -->
                            <div class="flex items-center justify-between mt-3">
                                <div
                                    class="flex items-center border border-stone-300 rounded-lg"
                                >
                                    <button
                                        onclick={() =>
                                            updateQty(
                                                item.id,
                                                item.quantity - 1,
                                            )}
                                        class="px-2.5 py-1.5 text-stone-600 hover:bg-stone-50"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span
                                        class="w-8 text-center text-sm font-medium"
                                        >{item.quantity}</span
                                    >
                                    <button
                                        onclick={() =>
                                            updateQty(
                                                item.id,
                                                item.quantity + 1,
                                            )}
                                        class="px-2.5 py-1.5 text-stone-600 hover:bg-stone-50"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <button
                                    onclick={() => remove(item.id)}
                                    class="p-1.5 text-stone-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                {/each}

                <button
                    onclick={clearCart}
                    class="text-sm text-stone-400 hover:text-red-500 transition-colors"
                >
                    Clear Cart
                </button>
            </div>

            <!-- Order Summary -->
            <div class="lg:col-span-1">
                <div
                    class="bg-white rounded-xl border border-stone-200 p-6 sticky top-20"
                >
                    <h2
                        class="text-lg font-semibold font-[family-name:var(--font-heading)] text-stone-900 mb-4"
                    >
                        Order Summary
                    </h2>

                    <div class="space-y-3 text-sm">
                        <div class="flex justify-between text-stone-600">
                            <span>Subtotal ({count} items)</span>
                            <span class="font-medium">{formatPrice(total)}</span
                            >
                        </div>
                        <div class="flex justify-between text-stone-600">
                            <span>Shipping</span>
                            <span class="text-emerald-600 font-medium"
                                >FREE</span
                            >
                        </div>
                        <div
                            class="border-t border-stone-200 pt-3 flex justify-between text-base font-bold text-stone-900"
                        >
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                    </div>

                    <a
                        href="/checkout"
                        class="mt-5 w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all block text-center"
                    >
                        Proceed to Checkout <ArrowRight size={18} />
                    </a>

                    <a
                        href="/collections/sarees"
                        class="block mt-3 text-center text-sm text-stone-500 hover:text-rose-600"
                    >
                        ← Continue Shopping
                    </a>
                </div>
            </div>
        </div>
    {/if}
</div>
