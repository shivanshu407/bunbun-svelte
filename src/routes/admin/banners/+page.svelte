<script lang="ts">
    import { enhance } from "$app/forms";
    import {
        Plus,
        Trash2,
        ToggleLeft,
        ToggleRight,
        Image,
    } from "lucide-svelte";

    let { data, form } = $props();
    let showForm = $state(false);
</script>

<svelte:head><title>Banners | Admin</title></svelte:head>

<div>
    <div class="flex items-center justify-between mb-6">
        <h1
            class="text-2xl font-bold font-[family-name:var(--font-heading)] text-stone-900"
        >
            Banners
        </h1>
        <button
            onclick={() => (showForm = !showForm)}
            class="flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
            <Plus size={18} /> New Banner
        </button>
    </div>

    {#if form?.error}
        <div
            class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
        >
            {form.error}
        </div>
    {/if}
    {#if form?.success}
        <div
            class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700"
        >
            {form.success}
        </div>
    {/if}

    {#if showForm}
        <div
            class="bg-white rounded-xl border border-stone-200 p-6 mb-6 animate-fade-in"
        >
            <form
                method="POST"
                action="?/create"
                use:enhance
                class="grid md:grid-cols-2 gap-4"
            >
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1"
                        >Title *</label
                    >
                    <input
                        name="title"
                        required
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1"
                        >Subtitle</label
                    >
                    <input
                        name="subtitle"
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1"
                        >Image URL *</label
                    >
                    <input
                        name="imageUrl"
                        required
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1"
                        >Link URL</label
                    >
                    <input
                        name="linkUrl"
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1"
                        >Display Order</label
                    >
                    <input
                        name="order"
                        type="number"
                        value="0"
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div class="flex items-end gap-3 justify-end">
                    <button
                        type="button"
                        onclick={() => (showForm = false)}
                        class="px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-100 rounded-lg"
                        >Cancel</button
                    >
                    <button
                        type="submit"
                        class="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg"
                        >Create</button
                    >
                </div>
            </form>
        </div>
    {/if}

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#if data.banners.length === 0}
            <div
                class="md:col-span-3 py-16 text-center bg-white rounded-xl border border-stone-200"
            >
                <Image size={40} class="mx-auto text-stone-300 mb-3" />
                <p class="text-stone-500">No banners yet</p>
            </div>
        {:else}
            {#each data.banners as banner}
                <div
                    class="bg-white rounded-xl border border-stone-200 overflow-hidden"
                >
                    <div class="aspect-video bg-stone-100">
                        <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            class="w-full h-full object-cover"
                        />
                    </div>
                    <div class="p-4">
                        <h3 class="font-medium text-stone-800 text-sm">
                            {banner.title}
                        </h3>
                        {#if banner.subtitle}<p
                                class="text-xs text-stone-400 mt-0.5"
                            >
                                {banner.subtitle}
                            </p>{/if}
                        <div class="flex items-center justify-between mt-3">
                            <span
                                class="text-xs px-2 py-0.5 rounded-full {banner.isActive
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-stone-100 text-stone-500'}"
                            >
                                {banner.isActive ? "Active" : "Inactive"}
                            </span>
                            <div class="flex items-center gap-1">
                                <form
                                    method="POST"
                                    action="?/toggle"
                                    use:enhance
                                >
                                    <input
                                        type="hidden"
                                        name="id"
                                        value={banner.id}
                                    />
                                    <button
                                        type="submit"
                                        class="p-1.5 text-stone-400 hover:text-stone-700"
                                    >
                                        {#if banner.isActive}<ToggleRight
                                                size={18}
                                                class="text-emerald-500"
                                            />{:else}<ToggleLeft
                                                size={18}
                                            />{/if}
                                    </button>
                                </form>
                                <form
                                    method="POST"
                                    action="?/delete"
                                    use:enhance
                                    onsubmit={(e) => {
                                        if (!confirm("Delete?"))
                                            e.preventDefault();
                                    }}
                                >
                                    <input
                                        type="hidden"
                                        name="id"
                                        value={banner.id}
                                    />
                                    <button
                                        type="submit"
                                        class="p-1.5 text-stone-400 hover:text-red-500"
                                        ><Trash2 size={14} /></button
                                    >
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>
