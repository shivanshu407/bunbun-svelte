<script lang="ts">
    import { Heart, ShoppingBag, Trash2 } from "lucide-svelte";
    import { formatPrice, calculateDiscount } from "$lib/utils";
    import { invalidateAll } from "$app/navigation";

    let { data } = $props();

    async function removeFromWishlist(productId: string) {
        await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
        invalidateAll();
    }
</script>

<svelte:head><title>My Wishlist | BunBunClothing</title></svelte:head>

<div>
    <h2
        class="text-xl font-semibold font-[family-name:var(--font-heading)] text-stone-900 mb-4"
    >
        My Wishlist ❤️
    </h2>

    {#if data.items.length === 0}
        <div
            class="text-center py-20 bg-white rounded-2xl border border-stone-200"
        >
            <Heart size={48} class="mx-auto text-stone-300 mb-4" />
            <h2 class="text-lg font-semibold text-stone-800">
                Your wishlist is empty
            </h2>
            <p class="text-sm text-stone-500 mt-1">
                Save your favorite items here for later
            </p>
            <a
                href="/collections/sarees"
                class="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
                <ShoppingBag size={18} /> Start Shopping
            </a>
        </div>
    {:else}
        <div
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
            {#each data.items as item (item.id)}
                <div
                    class="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100 group"
                >
                    <a href="/products/{item.product.slug}" class="block">
                        <div class="relative aspect-[3/4] bg-stone-100">
                            {#if item.product.images[0]}
                                <img
                                    src={item.product.images[0].url}
                                    alt={item.product.name}
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                            {:else}
                                <div
                                    class="w-full h-full flex items-center justify-center bg-stone-100"
                                >
                                    <img
                                        src="/icons/product-placeholder.png"
                                        alt="No product"
                                        class="w-16 h-16 object-contain opacity-60"
                                    />
                                </div>
                            {/if}
                            {#if item.product.salePrice}
                                <span
                                    class="absolute top-3 left-3 discount-badge"
                                    >-{calculateDiscount(
                                        item.product.basePrice,
                                        item.product.salePrice,
                                    )}%</span
                                >
                            {/if}
                        </div>
                    </a>
                    <div class="p-3 md:p-4">
                        <p
                            class="text-xs text-rose-500 uppercase tracking-wider"
                        >
                            {item.product.category.name}
                        </p>
                        <h3
                            class="text-sm font-medium text-stone-800 truncate mt-0.5"
                        >
                            {item.product.name}
                        </h3>
                        <div class="flex items-center gap-2 mt-2">
                            {#if item.product.salePrice}
                                <span class="text-sm font-bold text-stone-900"
                                    >{formatPrice(item.product.salePrice)}</span
                                >
                                <span
                                    class="text-xs text-stone-400 line-through"
                                    >{formatPrice(item.product.basePrice)}</span
                                >
                            {:else}
                                <span class="text-sm font-bold text-stone-900"
                                    >{formatPrice(item.product.basePrice)}</span
                                >
                            {/if}
                        </div>
                        <button
                            onclick={() => removeFromWishlist(item.product.id)}
                            class="mt-3 w-full py-2 text-sm text-stone-500 hover:text-red-500 flex items-center justify-center gap-1.5 border border-stone-200 rounded-lg hover:border-red-200 transition-colors"
                        >
                            <Trash2 size={14} /> Remove
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
