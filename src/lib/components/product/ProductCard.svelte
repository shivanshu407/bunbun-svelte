<script lang="ts">
    import { Heart } from "lucide-svelte";
    import { formatPrice, calculateDiscount } from "$lib/utils";

    interface Props {
        product: {
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
        };
    }

    let { product }: Props = $props();

    let wishlisted = $state(false);

    function toggleWishlist(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        wishlisted = !wishlisted;
        // API call handled separately
        fetch(`/api/wishlist/${product.id}`, {
            method: wishlisted ? "POST" : "DELETE",
        });
    }
</script>

<a
    href="/products/{product.slug}"
    class="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
>
    <!-- Image -->
    <div class="relative aspect-[3/4] bg-stone-100 overflow-hidden">
        {#if product.images.length > 0}
            <img
                src={product.images[0].url}
                alt={product.images[0].alt ?? product.name}
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
            />
        {:else}
            <div
                class="w-full h-full flex items-center justify-center text-stone-300"
            >
                <p class="text-5xl">👗</p>
            </div>
        {/if}

        <!-- Badges -->
        <div class="absolute top-3 left-3 flex flex-col gap-1.5">
            {#if product.salePrice}
                <span class="discount-badge"
                    >-{calculateDiscount(
                        product.basePrice,
                        product.salePrice,
                    )}%</span
                >
            {/if}
            {#if product.isNewArrival}
                <span
                    class="bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full"
                    >NEW</span
                >
            {/if}
            {#if product.isTrending}
                <span
                    class="bg-rose-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full"
                    >🔥 HOT</span
                >
            {/if}
        </div>

        <!-- Wishlist -->
        <button
            onclick={toggleWishlist}
            class="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm transition-all opacity-0 group-hover:opacity-100"
            aria-label="Add to wishlist"
        >
            <Heart
                size={18}
                class={wishlisted
                    ? "fill-rose-500 text-rose-500"
                    : "text-stone-600"}
            />
        </button>

        <!-- Quick View on Hover -->
        <div
            class="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        >
            <span
                class="block w-full py-2.5 bg-stone-900/90 text-white text-center text-sm font-medium rounded-lg backdrop-blur-sm"
            >
                Quick View
            </span>
        </div>
    </div>

    <!-- Details -->
    <div class="p-3 md:p-4">
        <h3 class="text-sm font-medium text-stone-800 truncate">
            {product.name}
        </h3>

        <!-- Rating -->
        {#if product.reviewCount > 0}
            <div class="flex items-center gap-1 mt-1">
                {#each Array(5) as _, i}
                    <span
                        class="text-xs {i < Math.round(product.rating)
                            ? 'text-amber-400'
                            : 'text-stone-300'}">★</span
                    >
                {/each}
                <span class="text-xs text-stone-400 ml-1"
                    >({product.reviewCount})</span
                >
            </div>
        {/if}

        <!-- Price -->
        <div class="flex items-center gap-2 mt-2">
            {#if product.salePrice}
                <span class="price-sale text-base"
                    >{formatPrice(product.salePrice)}</span
                >
                <span class="price-original text-sm"
                    >{formatPrice(product.basePrice)}</span
                >
            {:else}
                <span class="price text-base text-stone-900"
                    >{formatPrice(product.basePrice)}</span
                >
            {/if}
        </div>
    </div>
</a>
