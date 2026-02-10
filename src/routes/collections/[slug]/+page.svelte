<script lang="ts">
    import ProductCard from "$lib/components/product/ProductCard.svelte";
    import { SlidersHorizontal, ChevronDown, Tag } from "lucide-svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    let { data } = $props();

    let sortOpen = $state(false);
    let filtersOpen = $state(false);

    const sortOptions = [
        { value: "newest", label: "Newest" },
        { value: "popular", label: "Most Popular" },
        { value: "rating", label: "Top Rated" },
        { value: "price-low", label: "Price: Low to High" },
        { value: "price-high", label: "Price: High to Low" },
    ];

    function updateSort(sort: string) {
        const url = new URL($page.url);
        url.searchParams.set("sort", sort);
        goto(url.toString(), { replaceState: true });
        sortOpen = false;
    }
</script>

<svelte:head>
    <title>{data.category.name} | BunBunClothing</title>
    <meta
        name="description"
        content="Shop {data.category.name} at BunBunClothing. {data.category
            .description ?? `Browse our ${data.category.name} collection.`}"
    />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Active Coupons Banner -->
    {#if data.coupons.length > 0}
        <div class="mb-6 flex flex-wrap gap-3">
            {#each data.coupons as coupon}
                <div
                    class="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg"
                >
                    <Tag size={16} class="text-amber-600" />
                    <span class="text-sm text-amber-800">
                        <span class="font-bold code">{coupon.code}</span>
                        — {coupon.type === "percentage"
                            ? `${coupon.value}% OFF`
                            : `₹${coupon.value} OFF`}
                        {#if coupon.minOrderAmount}
                            on orders above {coupon.minOrderAmount}
                        {/if}
                    </span>
                </div>
            {/each}
        </div>
    {/if}

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1
                class="text-2xl md:text-3xl font-semibold font-[family-name:var(--font-heading)] text-stone-900"
            >
                {data.category.name}
            </h1>
            <p class="text-sm text-stone-500 mt-1">
                {data.pagination.totalCount} products
            </p>
        </div>

        <div class="flex items-center gap-3">
            <!-- Filters Toggle (Mobile) -->
            <button
                onclick={() => (filtersOpen = !filtersOpen)}
                class="md:hidden flex items-center gap-1.5 px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-700 hover:bg-stone-50"
            >
                <SlidersHorizontal size={16} /> Filters
            </button>

            <!-- Sort -->
            <div class="relative">
                <button
                    onclick={() => (sortOpen = !sortOpen)}
                    class="flex items-center gap-1.5 px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-700 hover:bg-stone-50"
                >
                    Sort <ChevronDown
                        size={16}
                        class={sortOpen ? "rotate-180" : ""}
                    />
                </button>
                {#if sortOpen}
                    <div
                        class="absolute right-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-lg shadow-lg z-20 overflow-hidden"
                    >
                        {#each sortOptions as opt}
                            <button
                                onclick={() => updateSort(opt.value)}
                                class="block w-full text-left px-4 py-2.5 text-sm transition-colors
									{data.filters.sort === opt.value
                                    ? 'bg-rose-50 text-rose-700 font-medium'
                                    : 'text-stone-700 hover:bg-stone-50'}"
                            >
                                {opt.label}
                            </button>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    </div>

    <!-- Filters Sidebar (Mobile overlay) -->
    {#if filtersOpen}
        <div
            class="md:hidden mb-6 p-4 bg-stone-50 rounded-xl border border-stone-200 animate-fade-in"
        >
            <h3 class="text-sm font-semibold text-stone-800 mb-3">
                Filter by Fabric
            </h3>
            <div class="flex flex-wrap gap-2">
                {#each ["Silk", "Cotton", "Georgette", "Chiffon", "Linen"] as fab}
                    <a
                        href="?fabric={fab.toLowerCase()}"
                        class="px-3 py-1.5 text-xs rounded-full border transition-colors
							{data.filters.fabric === fab.toLowerCase()
                            ? 'bg-rose-500 text-white border-rose-500'
                            : 'border-stone-300 text-stone-600 hover:border-rose-300'}"
                    >
                        {fab}
                    </a>
                {/each}
            </div>
        </div>
    {/if}

    <div class="flex gap-8">
        <!-- Desktop Sidebar Filters -->
        <aside class="hidden md:block w-56 flex-shrink-0 space-y-6">
            <div>
                <h3 class="text-sm font-semibold text-stone-800 mb-3">
                    Fabric
                </h3>
                <div class="space-y-2">
                    {#each ["Silk", "Cotton", "Georgette", "Chiffon", "Linen"] as fab}
                        <a
                            href="?fabric={fab.toLowerCase()}&sort={data.filters
                                .sort}"
                            class="block text-sm transition-colors
								{data.filters.fabric === fab.toLowerCase()
                                ? 'text-rose-600 font-medium'
                                : 'text-stone-600 hover:text-rose-600'}"
                        >
                            {fab}
                        </a>
                    {/each}
                    {#if data.filters.fabric}
                        <a
                            href="?sort={data.filters.sort}"
                            class="block text-xs text-stone-400 hover:text-rose-500 mt-2"
                        >
                            Clear filter ×
                        </a>
                    {/if}
                </div>
            </div>

            <div>
                <h3 class="text-sm font-semibold text-stone-800 mb-3">
                    Price Range
                </h3>
                <div class="space-y-2">
                    {#each [{ label: "Under ₹500", min: "0", max: "500" }, { label: "₹500 - ₹1000", min: "500", max: "1000" }, { label: "₹1000 - ₹2000", min: "1000", max: "2000" }, { label: "Above ₹2000", min: "2000", max: "" }] as range}
                        <a
                            href="?minPrice={range.min}&maxPrice={range.max}&sort={data
                                .filters.sort}"
                            class="block text-sm text-stone-600 hover:text-rose-600 transition-colors"
                        >
                            {range.label}
                        </a>
                    {/each}
                </div>
            </div>
        </aside>

        <!-- Product Grid -->
        <div class="flex-1">
            {#if data.products.length === 0}
                <div class="text-center py-20">
                    <p class="text-5xl mb-4">🛍️</p>
                    <p class="text-stone-500 font-medium">No products found</p>
                    <p class="text-sm text-stone-400 mt-1">
                        Try adjusting your filters
                    </p>
                </div>
            {:else}
                <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {#each data.products as product (product.id)}
                        <ProductCard {product} />
                    {/each}
                </div>

                <!-- Pagination -->
                {#if data.pagination.totalPages > 1}
                    <div class="flex items-center justify-center gap-2 mt-10">
                        {#each Array(data.pagination.totalPages) as _, i}
                            <a
                                href="?page={i + 1}&sort={data.filters.sort}"
                                class="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all
									{data.pagination.page === i + 1
                                    ? 'bg-rose-500 text-white'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}"
                            >
                                {i + 1}
                            </a>
                        {/each}
                    </div>
                {/if}
            {/if}
        </div>
    </div>
</div>
