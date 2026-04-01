<script lang="ts">
    import { enhance } from "$app/forms";
    import {
        Search,
        Plus,
        Trash2,
        Eye,
        EyeOff,
        Star,
        Package,
    } from "lucide-svelte";
    import { formatPrice } from "$lib/utils";
    import ImagePlaceholder from "$lib/components/ui/ImagePlaceholder.svelte";
    import { goto } from "$app/navigation";

    let { data, form } = $props();
    let searchQuery = $state(data.search);
</script>

<svelte:head><title>Products | Admin</title></svelte:head>

<div>
    <div class="flex items-center justify-between mb-6">
        <h1
            class="text-2xl font-bold font-[family-name:var(--font-heading)] text-stone-900"
        >
            Products
        </h1>
        <a
            href="/admin/products/new"
            class="flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
            <Plus size={18} /> Add Product
        </a>
    </div>

    {#if form?.success}
        <div
            class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700"
        >
            {form.success}
        </div>
    {/if}

    <!-- Search -->
    <div class="mb-4">
        <form
            onsubmit={(e) => {
                e.preventDefault();
                goto(`?search=${searchQuery}`);
            }}
            class="relative max-w-md"
        >
            <Search
                size={18}
                class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
                type="text"
                placeholder="Search products..."
                bind:value={searchQuery}
                class="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
        </form>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {#if data.products.length === 0}
            <div class="py-16 text-center">
                <Package size={40} class="mx-auto text-stone-300 mb-3" />
                <p class="text-stone-500">No products found</p>
            </div>
        {:else}
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-stone-50">
                        <tr>
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Product</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Category</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Price</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Variants</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Status</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Actions</th
                            >
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-stone-100">
                        {#each data.products as product}
                            <tr class="hover:bg-stone-50 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="w-12 h-12 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0"
                                        >
                                            {#if product.images[0]}
                                                <img
                                                    src={product.images[0].url}
                                                    alt=""
                                                    class="w-full h-full object-cover"
                                                />
                                            {:else}
                                                <ImagePlaceholder size="sm" />
                                            {/if}
                                        </div>
                                        <div>
                                            <p
                                                class="text-sm font-medium text-stone-800 truncate max-w-[200px]"
                                            >
                                                {product.name}
                                            </p>
                                            <p class="text-xs text-stone-400">
                                                {product._count.reviews} reviews
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-sm text-stone-600"
                                    >{product.category.name}</td
                                >
                                <td class="px-6 py-4">
                                    <div class="text-sm">
                                        {#if product.salePrice}
                                            <span
                                                class="font-semibold text-primary-600"
                                                >{formatPrice(
                                                    product.salePrice,
                                                )}</span
                                            >
                                            <span
                                                class="text-stone-400 line-through ml-1"
                                                >{formatPrice(
                                                    product.basePrice,
                                                )}</span
                                            >
                                        {:else}
                                            <span
                                                class="font-semibold text-stone-800"
                                                >{formatPrice(
                                                    product.basePrice,
                                                )}</span
                                            >
                                        {/if}
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-sm text-stone-600"
                                    >{product._count.variants}</td
                                >
                                <td class="px-6 py-4">
                                    <span
                                        class="inline-block px-2 py-0.5 text-xs rounded-full font-medium
										{product.isActive
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-stone-100 text-stone-500'}"
                                    >
                                        {product.isActive ? "Active" : "Draft"}
                                    </span>
                                    {#if product.isFeatured}
                                        <span
                                            class="inline-block px-2 py-0.5 text-xs rounded-full font-medium bg-amber-100 text-amber-700 ml-1"
                                            >Featured</span
                                        >
                                    {/if}
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-1">
                                        <a
                                            href="/admin/products/{product.id}/edit"
                                            class="p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
                                            title="Edit"
                                        >
                                            <Package size={16} />
                                        </a>
                                        <form
                                            method="POST"
                                            action="?/toggleActive"
                                            use:enhance
                                        >
                                            <input
                                                type="hidden"
                                                name="id"
                                                value={product.id}
                                            />
                                            <button
                                                type="submit"
                                                class="p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
                                                title="Toggle"
                                            >
                                                {#if product.isActive}<Eye
                                                        size={16}
                                                    />{:else}<EyeOff
                                                        size={16}
                                                    />{/if}
                                            </button>
                                        </form>
                                        <form
                                            method="POST"
                                            action="?/toggleFeatured"
                                            use:enhance
                                        >
                                            <input
                                                type="hidden"
                                                name="id"
                                                value={product.id}
                                            />
                                            <button
                                                type="submit"
                                                class="p-1.5 transition-colors {product.isFeatured
                                                    ? 'text-amber-500'
                                                    : 'text-stone-400 hover:text-amber-500'}"
                                                title="Featured"
                                            >
                                                <Star
                                                    size={16}
                                                    class={product.isFeatured
                                                        ? "fill-amber-500"
                                                        : ""}
                                                />
                                            </button>
                                        </form>
                                        <form
                                            method="POST"
                                            action="?/delete"
                                            use:enhance
                                            onsubmit={(e) => {
                                                if (
                                                    !confirm(
                                                        "Delete this product?",
                                                    )
                                                )
                                                    e.preventDefault();
                                            }}
                                        >
                                            <input
                                                type="hidden"
                                                name="id"
                                                value={product.id}
                                            />
                                            <button
                                                type="submit"
                                                class="p-1.5 text-stone-400 hover:text-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            {#if data.pagination.totalPages > 1}
                <div
                    class="flex items-center justify-between px-6 py-4 border-t border-stone-200"
                >
                    <p class="text-sm text-stone-500">
                        Showing {(data.pagination.page - 1) *
                            data.pagination.perPage +
                            1} to {Math.min(
                            data.pagination.page * data.pagination.perPage,
                            data.pagination.total,
                        )} of {data.pagination.total}
                    </p>
                    <div class="flex gap-1">
                        {#each Array(data.pagination.totalPages) as _, i}
                            <a
                                href="?page={i + 1}&search={data.search}"
                                class="w-8 h-8 flex items-center justify-center rounded text-sm
									{data.pagination.page === i + 1
                                    ? 'bg-primary-500 text-white'
                                    : 'text-stone-600 hover:bg-stone-100'}"
                            >
                                {i + 1}
                            </a>
                        {/each}
                    </div>
                </div>
            {/if}
        {/if}
    </div>
</div>
