<script lang="ts">
    import { enhance } from "$app/forms";
    import { Plus, Trash2, FolderTree } from "lucide-svelte";

    let { data, form } = $props();
    let showForm = $state(false);
    let slugValue = $state("");

    function generateSlug(name: string) {
        slugValue = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }
</script>

<svelte:head><title>Categories | Admin</title></svelte:head>

<div>
    <div class="flex items-center justify-between mb-6">
        <h1
            class="text-2xl font-bold font-[family-name:var(--font-heading)] text-stone-900"
        >
            Categories
        </h1>
        <button
            onclick={() => (showForm = !showForm)}
            class="flex items-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
            <Plus size={18} /> Add Category
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
            <h2 class="text-lg font-semibold text-stone-900 mb-4">
                New Category
            </h2>
            <form
                method="POST"
                action="?/create"
                use:enhance
                class="grid md:grid-cols-2 gap-4"
            >
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1"
                        >Name *</label
                    >
                    <input
                        name="name"
                        required
                        placeholder="e.g. Silk Sarees"
                        oninput={(e) => generateSlug(e.currentTarget.value)}
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1"
                        >Slug *</label
                    >
                    <input
                        name="slug"
                        required
                        bind:value={slugValue}
                        placeholder="silk-sarees"
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1"
                        >Parent Category</label
                    >
                    <select
                        name="parentId"
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                        <option value="">None (Top Level)</option>
                        {#each data.categories.filter((c) => !c.parentId) as cat}
                            <option value={cat.id}>{cat.name}</option>
                        {/each}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1"
                        >Image URL</label
                    >
                    <input
                        name="image"
                        placeholder="https://..."
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                </div>
                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-stone-700 mb-1"
                        >Description</label
                    >
                    <textarea
                        name="description"
                        rows="2"
                        placeholder="Category description"
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    ></textarea>
                </div>
                <div class="md:col-span-2 flex gap-3 justify-end">
                    <button
                        type="button"
                        onclick={() => (showForm = false)}
                        class="px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-100 rounded-lg"
                        >Cancel</button
                    >
                    <button
                        type="submit"
                        class="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-lg"
                        >Create</button
                    >
                </div>
            </form>
        </div>
    {/if}

    <div class="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {#if data.categories.length === 0}
            <div class="py-16 text-center">
                <FolderTree size={40} class="mx-auto text-stone-300 mb-3" />
                <p class="text-stone-500">No categories yet</p>
            </div>
        {:else}
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-stone-50">
                        <tr>
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Name</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Slug</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Parent</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Products</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Actions</th
                            >
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-stone-100">
                        {#each data.categories as cat}
                            <tr class="hover:bg-stone-50 transition-colors">
                                <td
                                    class="px-6 py-4 text-sm font-medium text-stone-800"
                                    >{cat.name}</td
                                >
                                <td
                                    class="px-6 py-4 text-sm text-stone-500 code"
                                    >{cat.slug}</td
                                >
                                <td class="px-6 py-4 text-sm text-stone-500"
                                    >{cat.parent?.name ?? "—"}</td
                                >
                                <td class="px-6 py-4 text-sm text-stone-600"
                                    >{cat._count.products}</td
                                >
                                <td class="px-6 py-4">
                                    <form
                                        method="POST"
                                        action="?/delete"
                                        use:enhance
                                        onsubmit={(e) => {
                                            if (
                                                !confirm(
                                                    "Delete this category?",
                                                )
                                            )
                                                e.preventDefault();
                                        }}
                                    >
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={cat.id}
                                        />
                                        <button
                                            type="submit"
                                            class="p-1.5 text-stone-400 hover:text-red-500 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    </div>
</div>
