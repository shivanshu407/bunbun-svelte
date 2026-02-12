<script lang="ts">
    import {
        Heart,
        ShoppingBag,
        Minus,
        Plus,
        Star,
        Truck,
        RotateCcw,
        Shield,
        Tag,
        ChevronLeft,
        ChevronRight,
    } from "lucide-svelte";
    import { cartItems, cartDrawerOpen } from "$lib/stores/cart";
    import { formatPrice, calculateDiscount } from "$lib/utils";
    import ProductCard from "$lib/components/product/ProductCard.svelte";
    import { recentlyViewed } from "$lib/stores/recentlyViewed";
    import { wishlistIds } from "$lib/stores/wishlist";
    import { currentUser } from "$lib/stores/user";
    import { toast } from "$lib/stores/toast";

    let { data } = $props();
    let product = $derived(data.product);
    let coupons = $derived(data.coupons);
    let related = $derived(data.related);

    let selectedVariant = $state(product.variants[0] ?? null);
    let quantity = $state(1);
    let activeImage = $state(0);

    // Sync wishlist with global store
    let wishlistSet = $state<Set<string>>(new Set());
    wishlistIds.subscribe((v) => (wishlistSet = v));
    let wishlisted = $derived(wishlistSet.has(product.id));

    // Reset state when product changes (navigation)
    $effect(() => {
        // We use the ID to detect change
        const _id = product.id;
        selectedVariant = product.variants[0] ?? null;
        quantity = 1;
        activeImage = 0;
    });

    let displayPrice = $derived(
        selectedVariant?.salePrice ??
            selectedVariant?.price ??
            product.salePrice ??
            product.basePrice,
    );
    let originalPrice = $derived(selectedVariant?.price ?? product.basePrice);
    let hasDiscount = $derived(displayPrice < originalPrice);

    function addToCart() {
        if (!selectedVariant) return;
        cartItems.addItem({
            id: `${product.id}-${selectedVariant.id}`,
            productId: product.id,
            variantId: selectedVariant.id,
            name: product.name,
            image: product.images[0]?.url ?? "",
            size: selectedVariant.size ?? undefined,
            color: selectedVariant.color ?? undefined,
            price: selectedVariant.price,
            salePrice: selectedVariant.salePrice ?? undefined,
            quantity,
        });
        cartDrawerOpen.set(true);

        // Also persist to server if user is logged in
        fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                productId: product.id,
                variantId: selectedVariant.id,
                quantity,
            }),
        });
    }

    function toggleWishlist() {
        if (!$currentUser) {
            window.location.href = "/login?wishlist=true";
            return;
        }

        const added = wishlistIds.toggle(product.id);
        fetch(`/api/wishlist/${product.id}`, {
            method: added ? "POST" : "DELETE",
        });
    }

    // Group variants by attribute
    let sizes = $derived([
        ...new Set(product.variants.map((v: any) => v.size).filter(Boolean)),
    ]);
    let colors = $derived([
        ...new Set(product.variants.map((v: any) => v.color).filter(Boolean)),
    ]);

    // Track recently viewed
    $effect(() => {
        recentlyViewed.addProduct({
            id: product.id,
            name: product.name,
            slug: product.slug,
            basePrice: product.basePrice,
            salePrice: product.salePrice,
            rating: product.rating,
            reviewCount: product.reviewCount,
            isTrending: product.isTrending,
            isNewArrival: product.isNewArrival,
            images: product.images,
        });
    });

    let viewHistory = $derived(
        $recentlyViewed.filter((i) => i.id !== product.id),
    );
</script>

<svelte:head>
    <title>{product.name} | BunBunClothing</title>
    <meta
        name="description"
        content={product.shortDescription ?? product.description?.slice(0, 160)}
    />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-6 md:py-10">
    <!-- Breadcrumb -->
    <nav class="text-sm text-stone-400 mb-6">
        <a href="/" class="hover:text-rose-500">Home</a> /
        <a
            href="/collections/{product.category.slug}"
            class="hover:text-rose-500">{product.category.name}</a
        >
        /
        <span class="text-stone-600">{product.name}</span>
    </nav>

    <div class="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <!-- Image Gallery -->
        <div class="space-y-3">
            <div
                class="relative aspect-square bg-stone-100 rounded-2xl overflow-hidden"
            >
                {#if product.images.length > 0}
                    <img
                        src={product.images[activeImage].url}
                        alt={product.images[activeImage].alt ?? product.name}
                        class="w-full h-full object-cover"
                    />
                {:else}
                    <div
                        class="w-full h-full flex items-center justify-center text-stone-300 text-8xl"
                    >
                        👗
                    </div>
                {/if}

                {#if product.images.length > 1}
                    <button
                        onclick={() =>
                            (activeImage = Math.max(0, activeImage - 1))}
                        class="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onclick={() =>
                            (activeImage = Math.min(
                                product.images.length - 1,
                                activeImage + 1,
                            ))}
                        class="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                {/if}

                {#if hasDiscount}
                    <span class="absolute top-4 left-4 discount-badge text-sm">
                        -{calculateDiscount(originalPrice, displayPrice)}% OFF
                    </span>
                {/if}
            </div>

            <!-- Thumbnails -->
            {#if product.images.length > 1}
                <div class="flex gap-2 overflow-x-auto">
                    {#each product.images as img, i}
                        <button
                            onclick={() => (activeImage = i)}
                            class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all
								{activeImage === i
                                ? 'border-rose-500'
                                : 'border-transparent hover:border-stone-300'}"
                        >
                            <img
                                src={img.url}
                                alt={img.alt ?? ""}
                                class="w-full h-full object-cover"
                            />
                        </button>
                    {/each}
                </div>
            {/if}
        </div>

        <!-- Product Details -->
        <div class="space-y-5">
            <div>
                <p
                    class="text-sm text-rose-600 font-medium uppercase tracking-wider"
                >
                    {product.category.name}
                </p>
                <h1
                    class="text-2xl md:text-3xl font-bold font-[family-name:var(--font-heading)] text-stone-900 mt-1"
                >
                    {product.name}
                </h1>

                <!-- Rating -->
                {#if product.reviewCount > 0}
                    <div class="flex items-center gap-2 mt-2">
                        <div class="flex items-center">
                            {#each Array(5) as _, i}
                                <Star
                                    size={16}
                                    class={i < Math.round(product.rating)
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-stone-300"}
                                />
                            {/each}
                        </div>
                        <span class="text-sm text-stone-500"
                            >{product.rating.toFixed(1)} ({product.reviewCount} reviews)</span
                        >
                    </div>
                {/if}
            </div>

            <!-- Price -->
            <div class="flex items-baseline gap-3">
                <span class="text-3xl font-bold text-stone-900"
                    >{formatPrice(displayPrice)}</span
                >
                {#if hasDiscount}
                    <span class="text-lg text-stone-400 line-through"
                        >{formatPrice(originalPrice)}</span
                    >
                    <span
                        class="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded"
                    >
                        Save {formatPrice(originalPrice - displayPrice)}
                    </span>
                {/if}
            </div>

            <!-- Coupons -->
            {#if coupons.length > 0}
                <div class="space-y-2">
                    {#each coupons as coupon}
                        <div
                            class="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm"
                        >
                            <Tag
                                size={14}
                                class="text-amber-600 flex-shrink-0"
                            />
                            <span class="text-amber-800">
                                Use <span class="font-bold code"
                                    >{coupon.code}</span
                                >
                                for
                                {coupon.type === "percentage"
                                    ? `${coupon.value}% off`
                                    : `₹${coupon.value} off`}
                                {#if coupon.minOrderAmount}on orders above ₹{coupon.minOrderAmount}{/if}
                            </span>
                        </div>
                    {/each}
                </div>
            {/if}

            <!-- Size Selection -->
            {#if sizes.length > 0}
                <div>
                    <h3 class="text-sm font-semibold text-stone-800 mb-2">
                        Size
                    </h3>
                    <div class="flex flex-wrap gap-2">
                        {#each product.variants.filter((v: any) => v.size) as variant}
                            <button
                                onclick={() => (selectedVariant = variant)}
                                class="px-4 py-2 border rounded-lg text-sm font-medium transition-all
									{selectedVariant?.id === variant.id
                                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                                    : 'border-stone-300 text-stone-700 hover:border-rose-300'}
									{variant.stock === 0 ? 'opacity-40 cursor-not-allowed line-through' : ''}"
                            >
                                {variant.size}
                            </button>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Color Selection -->
            {#if colors.length > 0}
                <div>
                    <h3 class="text-sm font-semibold text-stone-800 mb-2">
                        Color
                    </h3>
                    <div class="flex flex-wrap gap-2">
                        {#each product.variants.filter((v: any) => v.color) as variant}
                            <button
                                onclick={() => (selectedVariant = variant)}
                                class="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-all
									{selectedVariant?.id === variant.id
                                    ? 'border-rose-500 bg-rose-50'
                                    : 'border-stone-300 hover:border-rose-300'}"
                            >
                                {#if variant.colorHex}
                                    <span
                                        class="w-4 h-4 rounded-full border border-stone-200"
                                        style="background-color: {variant.colorHex}"
                                    ></span>
                                {/if}
                                {variant.color}
                            </button>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Quantity -->
            <div>
                <h3 class="text-sm font-semibold text-stone-800 mb-2">
                    Quantity
                </h3>
                <div
                    class="inline-flex items-center border border-stone-300 rounded-lg"
                >
                    <button
                        onclick={() => (quantity = Math.max(1, quantity - 1))}
                        class="px-3 py-2 text-stone-600 hover:bg-stone-50 transition-colors"
                    >
                        <Minus size={16} />
                    </button>
                    <span class="w-12 text-center text-sm font-medium"
                        >{quantity}</span
                    >
                    <button
                        onclick={() => (quantity = Math.min(10, quantity + 1))}
                        class="px-3 py-2 text-stone-600 hover:bg-stone-50 transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>
                {#if selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0}
                    <p class="text-xs text-amber-600 mt-1">
                        Only {selectedVariant.stock} left in stock!
                    </p>
                {/if}
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
                <button
                    onclick={addToCart}
                    disabled={!selectedVariant || selectedVariant.stock === 0}
                    class="flex-1 py-3.5 bg-rose-500 hover:bg-rose-600 disabled:bg-stone-300 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                    <ShoppingBag size={20} />
                    {selectedVariant?.stock === 0
                        ? "Out of Stock"
                        : "Add to Cart"}
                </button>
                <button
                    onclick={toggleWishlist}
                    class="p-3.5 border-2 rounded-xl transition-all
						{wishlisted
                        ? 'border-rose-500 bg-rose-50 text-rose-500'
                        : 'border-stone-300 text-stone-600 hover:border-rose-300'}"
                >
                    <Heart
                        size={20}
                        class={wishlisted ? "fill-rose-500" : ""}
                    />
                </button>
            </div>

            <!-- Trust -->
            <div class="grid grid-cols-3 gap-3 pt-4 border-t border-stone-200">
                {#each [{ icon: Truck, text: "Free Delivery" }, { icon: RotateCcw, text: "7-Day Returns" }, { icon: Shield, text: "100% Genuine" }] as item}
                    <div class="flex flex-col items-center text-center gap-1">
                        <item.icon size={18} class="text-stone-400" />
                        <span class="text-xs text-stone-500">{item.text}</span>
                    </div>
                {/each}
            </div>

            <!-- Description -->
            {#if product.description}
                <div class="pt-4 border-t border-stone-200">
                    <h3 class="text-sm font-semibold text-stone-800 mb-2">
                        Description
                    </h3>
                    <p
                        class="text-sm text-stone-600 leading-relaxed whitespace-pre-line"
                    >
                        {product.description}
                    </p>
                </div>
            {/if}

            <!-- Fabric & Care -->
            {#if product.fabric || product.careInstructions}
                <div class="pt-4 border-t border-stone-200">
                    {#if product.fabric}
                        <p class="text-sm">
                            <span class="font-medium text-stone-700"
                                >Fabric:</span
                            >
                            <span class="text-stone-600">{product.fabric}</span>
                        </p>
                    {/if}
                    {#if product.careInstructions}
                        <p class="text-sm mt-1">
                            <span class="font-medium text-stone-700">Care:</span
                            >
                            <span class="text-stone-600"
                                >{product.careInstructions}</span
                            >
                        </p>
                    {/if}
                </div>
            {/if}
        </div>
    </div>

    <!-- Reviews -->
    {#if product.reviews.length > 0}
        <section class="mt-16">
            <h2
                class="text-xl font-semibold font-[family-name:var(--font-heading)] text-stone-900 mb-6"
            >
                Customer Reviews
            </h2>
            <div class="grid md:grid-cols-2 gap-4">
                {#each product.reviews as review}
                    <div class="bg-stone-50 rounded-xl p-5">
                        <div class="flex items-center gap-1 mb-2">
                            {#each Array(5) as _, i}
                                <Star
                                    size={14}
                                    class={i < review.rating
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-stone-300"}
                                />
                            {/each}
                        </div>
                        {#if review.title}<h4
                                class="text-sm font-semibold text-stone-800"
                            >
                                {review.title}
                            </h4>{/if}
                        {#if review.content}<p
                                class="text-sm text-stone-600 mt-1"
                            >
                                {review.content}
                            </p>{/if}
                        <p class="text-xs text-stone-400 mt-3">
                            — {review.user.name}, {new Date(
                                review.createdAt,
                            ).toLocaleDateString("en-IN")}
                        </p>
                    </div>
                {/each}
            </div>
        </section>
    {/if}

    <!-- Recently Viewed -->
    {#if viewHistory.length > 0}
        <section class="mt-16 pt-16 border-t border-stone-200">
            <h2
                class="text-xl font-semibold font-[family-name:var(--font-heading)] text-stone-900 mb-6"
            >
                Recently Viewed
            </h2>
            <div
                class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            >
                {#each viewHistory as historyItem (historyItem.id)}
                    <div class="flex-shrink-0 w-48 snap-start">
                        <ProductCard product={historyItem} />
                    </div>
                {/each}
            </div>
        </section>
    {/if}

    <!-- Related Products -->
    {#if related.length > 0}
        <section class="mt-16">
            <h2
                class="text-xl font-semibold font-[family-name:var(--font-heading)] text-stone-900 mb-6"
            >
                You May Also Like
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {#each related as product (product.id)}
                    <ProductCard {product} />
                {/each}
            </div>
        </section>
    {/if}
</div>
