<script lang="ts">
    import { Search } from "lucide-svelte";
    import { goto } from "$app/navigation";
    import { formatPrice } from "$lib/utils";

    let { data } = $props();
    let searchQuery = $state(data.query);

    function handleSearch(e: Event) {
        e.preventDefault();
        if (searchQuery.trim())
            goto(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
</script>

<svelte:head
    ><title
        >{data.query ? `"${data.query}" — Search` : "Search"} | BunBunClothing</title
    ></svelte:head
>

<div class="max-w-6xl mx-auto px-4 py-8 md:py-12">
    <form onsubmit={handleSearch} class="max-w-xl mx-auto mb-8">
        <div class="relative">
            <Search
                size={20}
                class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
                bind:value={searchQuery}
                placeholder="Search for sarees, blouses, shapewear..."
                class="w-full pl-12 pr-4 py-3.5 border-2 border-stone-200 rounded-xl text-sm focus:outline-none focus:border-rose-500 transition-colors"
            />
        </div>
    </form>

    {#if data.query}
        <p class="text-sm text-stone-500 mb-4">
            {data.products.length} result{data.products.length !== 1 ? "s" : ""}
            for "<strong class="text-stone-800">{data.query}</strong>"
        </p>
    {/if}

    {#if data.products.length > 0}
        <div
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
            {#each data.products as product}
                <a
                    href="/products/{product.slug}"
                    class="group bg-white rounded-xl overflow-hidden border border-stone-100 hover:shadow-lg transition-all"
                >
                    <div class="aspect-[3/4] bg-stone-100 overflow-hidden">
                        {#if product.images[0]}
                            <img
                                src={product.images[0].url}
                                alt={product.name}
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        {:else}
                            <div
                                class="w-full h-full flex items-center justify-center text-3xl"
                            >
                                👗
                            </div>
                        {/if}
                    </div>
                    <div class="p-3">
                        <p class="text-xs text-rose-500 font-medium">
                            {product.category.name}
                        </p>
                        <h3
                            class="text-sm font-medium text-stone-800 mt-0.5 line-clamp-2"
                        >
                            {product.name}
                        </h3>
                        <div class="flex items-center gap-2 mt-1.5">
                            <span class="text-sm font-bold text-stone-900"
                                >{formatPrice(
                                    product.salePrice ?? product.basePrice,
                                )}</span
                            >
                            {#if product.salePrice && product.salePrice < product.basePrice}
                                <span
                                    class="text-xs text-stone-400 line-through"
                                    >{formatPrice(product.basePrice)}</span
                                >
                            {/if}
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    {:else if data.query}
        <div class="text-center py-16">
            <Search size={48} class="mx-auto text-stone-300 mb-4" />
            <h2 class="text-lg font-medium text-stone-700">
                No products found
            </h2>
            <p class="text-sm text-stone-400 mt-1">
                Try a different search term
            </p>
        </div>
    {:else}
        <div class="text-center py-16">
            <Search size={48} class="mx-auto text-stone-300 mb-4" />
            <h2 class="text-lg font-medium text-stone-700">
                Search BunBunClothing
            </h2>
            <p class="text-sm text-stone-400 mt-1">
                Find sarees, blouses, shapewear and more
            </p>
        </div>
    {/if}
</div>
