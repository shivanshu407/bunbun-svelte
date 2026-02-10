<script lang="ts">
    import {
        Minus,
        Plus,
        Trash2,
        ShoppingBag,
        ArrowRight,
        Tag,
        Copy,
        Check,
    } from "lucide-svelte";
    import { cartItems, cartTotal, cartCount } from "$lib/stores/cart";
    import { formatPrice } from "$lib/utils";
    import { onMount } from "svelte";
    import { invalidateAll } from "$app/navigation";

    let { data } = $props();

    // Sync server cart to client store on mount
    onMount(() => {
        if (data.cart?.items?.length) {
            const mapped = data.cart.items.map((item: any) => ({
                id: item.id,
                productId: item.productId,
                variantId: item.variantId,
                name: item.product.name,
                image: item.product.images?.[0]?.url || "",
                size: item.variant.size || undefined,
                color: item.variant.color || undefined,
                price: item.variant.price,
                salePrice: item.variant.salePrice || undefined,
                quantity: item.quantity,
            }));
            cartItems.set(mapped);
        }
    });

    let items = $state<any[]>([]);
    let total = $state(0);
    let count = $state(0);

    cartItems.subscribe((v) => (items = v));
    cartTotal.subscribe((v) => (total = v));
    cartCount.subscribe((v) => (count = v));

    // Use server data on first render, then store data takes over
    let serverItems = $derived(
        data.cart?.items?.map((item: any) => ({
            id: item.id,
            productId: item.productId,
            variantId: item.variantId,
            name: item.product.name,
            image: item.product.images?.[0]?.url || "",
            size: item.variant.size || undefined,
            color: item.variant.color || undefined,
            price: item.variant.price,
            salePrice: item.variant.salePrice || undefined,
            quantity: item.quantity,
        })) ?? [],
    );

    let displayItems = $derived(items.length > 0 ? items : serverItems);
    let displayTotal = $derived(
        items.length > 0 ? total : (data.subtotal ?? 0),
    );
    let displayCount = $derived(
        items.length > 0 ? count : (data.cart?.items?.length ?? 0),
    );

    // Coupon state
    let couponCode = $state("");
    let appliedCoupon = $state<any>(null);
    let couponError = $state("");
    let copiedCode = $state("");

    function applyCoupon() {
        couponError = "";
        if (!couponCode.trim()) {
            couponError = "Enter a coupon code";
            return;
        }

        const coupon = data.coupons?.find(
            (c: any) =>
                c.code.toLowerCase() === couponCode.trim().toLowerCase(),
        );
        if (!coupon) {
            couponError = "Invalid or expired coupon";
            return;
        }

        if (coupon.minOrderAmount && displayTotal < coupon.minOrderAmount) {
            couponError = `Minimum order of ${formatPrice(coupon.minOrderAmount)} required`;
            return;
        }

        appliedCoupon = coupon;
        couponCode = "";
    }

    function removeCoupon() {
        appliedCoupon = null;
        couponError = "";
    }

    let discount = $derived(
        appliedCoupon
            ? appliedCoupon.type === "percentage"
                ? Math.min(
                      (displayTotal * appliedCoupon.value) / 100,
                      appliedCoupon.maxDiscount ?? Infinity,
                  )
                : appliedCoupon.value
            : 0,
    );

    let finalTotal = $derived(Math.max(0, displayTotal - discount));

    async function updateQty(id: string, qty: number) {
        cartItems.updateQuantity(id, qty);
        // Sync with server via PATCH
        await fetch(`/api/cart`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemId: id, quantity: qty }),
        });
    }

    async function remove(id: string) {
        cartItems.removeItem(id);
        // PATCH with quantity 0 deletes the item server-side
        await fetch(`/api/cart`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemId: id, quantity: 0 }),
        });
    }

    async function clearCart() {
        cartItems.clear();
        await fetch("/api/cart", { method: "DELETE" });
    }

    function copyCode(code: string) {
        navigator.clipboard.writeText(code);
        copiedCode = code;
        setTimeout(() => (copiedCode = ""), 2000);
    }
</script>

<svelte:head>
    <title>Shopping Cart | BunBunClothing</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-4 py-8 md:py-12">
    <h1
        class="text-2xl md:text-3xl font-semibold font-[family-name:var(--font-heading)] text-stone-900 mb-6"
    >
        Shopping Cart ({displayCount}
        {displayCount === 1 ? "item" : "items"})
    </h1>

    {#if displayItems.length === 0}
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
                {#each displayItems as item (item.id)}
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
            <div class="lg:col-span-1 space-y-4">
                <!-- Coupon Section -->
                <div class="bg-white rounded-xl border border-stone-200 p-5">
                    <h3
                        class="text-sm font-semibold text-stone-900 flex items-center gap-2 mb-3"
                    >
                        <Tag size={16} class="text-rose-500" />
                        Apply Coupon
                    </h3>

                    {#if appliedCoupon}
                        <div
                            class="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2"
                        >
                            <div>
                                <span class="text-sm font-bold text-emerald-700"
                                    >{appliedCoupon.code}</span
                                >
                                <span class="text-xs text-emerald-600 ml-1">
                                    (-{appliedCoupon.type === "percentage"
                                        ? `${appliedCoupon.value}%`
                                        : formatPrice(appliedCoupon.value)})
                                </span>
                            </div>
                            <button
                                onclick={removeCoupon}
                                class="text-xs text-red-500 hover:text-red-600 font-medium"
                            >
                                Remove
                            </button>
                        </div>
                    {:else}
                        <div class="flex gap-2">
                            <input
                                type="text"
                                bind:value={couponCode}
                                placeholder="Enter coupon code"
                                class="flex-1 min-w-0 px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                                onkeydown={(e) =>
                                    e.key === "Enter" && applyCoupon()}
                            />
                            <button
                                onclick={applyCoupon}
                                class="flex-shrink-0 px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                Apply
                            </button>
                        </div>
                        {#if couponError}
                            <p class="text-xs text-red-500 mt-1.5">
                                {couponError}
                            </p>
                        {/if}
                    {/if}

                    <!-- Available Coupons -->
                    {#if data.coupons?.length > 0 && !appliedCoupon}
                        <div class="mt-3 pt-3 border-t border-stone-100">
                            <p class="text-xs font-medium text-stone-500 mb-2">
                                Available Coupons
                            </p>
                            <div class="space-y-2">
                                {#each data.coupons as coupon}
                                    <div
                                        class="flex items-center justify-between bg-stone-50 rounded-lg px-3 py-2"
                                    >
                                        <div>
                                            <span
                                                class="text-xs font-bold text-stone-800 font-mono"
                                                >{coupon.code}</span
                                            >
                                            <p
                                                class="text-xs text-stone-500 mt-0.5"
                                            >
                                                {coupon.type === "percentage"
                                                    ? `${coupon.value}% off`
                                                    : `${formatPrice(coupon.value)} off`}
                                                {#if coupon.maxDiscount}(up to ₹{coupon.maxDiscount}){/if}
                                                {#if coupon.minOrderAmount}
                                                    · Min {formatPrice(
                                                        coupon.minOrderAmount,
                                                    )}
                                                {/if}
                                            </p>
                                        </div>
                                        <button
                                            onclick={() =>
                                                copyCode(coupon.code)}
                                            class="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium"
                                        >
                                            {#if copiedCode === coupon.code}
                                                <Check size={12} /> Copied
                                            {:else}
                                                <Copy size={12} /> Copy
                                            {/if}
                                        </button>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/if}
                </div>

                <!-- Summary -->
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
                            <span>Subtotal ({displayCount} items)</span>
                            <span class="font-medium"
                                >{formatPrice(displayTotal)}</span
                            >
                        </div>
                        {#if discount > 0}
                            <div class="flex justify-between text-emerald-600">
                                <span>Coupon Discount</span>
                                <span class="font-medium"
                                    >-{formatPrice(discount)}</span
                                >
                            </div>
                        {/if}
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
                            <span>{formatPrice(finalTotal)}</span>
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
