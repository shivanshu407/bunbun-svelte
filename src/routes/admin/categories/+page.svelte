<script lang="ts">
    import { enhance } from "$app/forms";
    import { Plus, Trash2, FolderTree, Upload, Pencil } from "lucide-svelte";

    let { data, form } = $props();
    let showForm = $state(false);
    let slugValue = $state("");
    let editingId = $state<string | null>(null);

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
        <h1 class="text-2xl font-bold font-[family-name:var(--font-heading)] text-stone-900">
            Categories
        </h1>
        <button
            onclick={() => (showForm = !showForm)}
            class="flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
            <Plus size={18} /> Add Category
        </button>
    </div>

    {#if form?.error}
        <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {form.error}
        </div>
    {/if}
    {#if form?.success}
        <div class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            {form.success}
        </div>
    {/if}

    {#if showForm}
        <div class="bg-white rounded-xl border border-stone-200 p-6 mb-6 animate-fade-in">
            <h2 class="text-lg font-semibold text-stone-900 mb-4">New Category</h2>
            <form method="POST" action="?/create" enctype="multipart/form-data" use:enhance class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1">Name *</label>
                    <input
                        name="name" required placeholder="e.g. Shapewear"
                        oninput={(e) => generateSlug(e.currentTarget.value)}
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1">Slug *</label>
                    <input
                        name="slug" required bind:value={slugValue} placeholder="shapewear"
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1">Parent Category</label>
                    <select
                        name="parentId"
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">None (Top Level)</option>
                        {#each data.categories.filter((c) => !c.parentId) as cat}
                            <option value={cat.id}>{cat.name}</option>
                        {/each}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1">Display Order</label>
                    <input
                        name="order" type="number" value="0"
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1">Cover Image</label>
                    <input
                        type="file" name="imageFile" accept="image/*"
                        class="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-primary-50 file:text-primary-700 file:font-medium file:text-sm"
                    />
                    <p class="text-xs text-stone-400 mt-1">Used as category thumbnail on homepage</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1">Description</label>
                    <textarea
                        name="description" rows="2" placeholder="Category description"
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    ></textarea>
                </div>
                <div class="md:col-span-2 flex gap-3 justify-end">
                    <button type="button" onclick={() => (showForm = false)} class="px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-100 rounded-lg">Cancel</button>
                    <button type="submit" class="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg">Create</button>
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
            <div class="divide-y divide-stone-100">
                {#each data.categories as cat}
                    <div class="flex items-center gap-4 px-6 py-4 hover:bg-stone-50 transition-colors">
                        <!-- Image Preview -->
                        <div class="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100 border border-stone-200">
                            {#if cat.image}
                                <img src={cat.image} alt={cat.name} class="w-full h-full object-cover" />
                            {:else}
                                <div class="w-full h-full flex items-center justify-center text-stone-300">
                                    <Upload size={18} />
                                </div>
                            {/if}
                        </div>

                        <!-- Info -->
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-semibold text-stone-900">{cat.name}</span>
                                <span class="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{cat.slug}</span>
                            </div>
                            <div class="flex items-center gap-3 mt-0.5 text-xs text-stone-400">
                                <span>{cat._count.products} products</span>
                                {#if cat.parent?.name}
                                    <span>Parent: {cat.parent.name}</span>
                                {/if}
                                <span>Order: {cat.order}</span>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex items-center gap-2 flex-shrink-0">
                            <!-- Edit Image / Update -->
                            <button
                                onclick={() => editingId = editingId === cat.id ? null : cat.id}
                                class="p-2 text-stone-400 hover:text-primary-500 transition-colors" title="Edit"
                            >
                                <Pencil size={16} />
                            </button>

                            <!-- Delete -->
                            <form method="POST" action="?/delete" use:enhance
                                onsubmit={(e) => { if (!confirm("Delete this category?")) e.preventDefault(); }}
                            >
                                <input type="hidden" name="id" value={cat.id} />
                                <button type="submit" class="p-2 text-stone-400 hover:text-red-500 transition-colors" title="Delete">
                                    <Trash2 size={16} />
                                </button>
                            </form>
                        </div>
                    </div>

                    <!-- Inline Edit Form -->
                    {#if editingId === cat.id}
                        <div class="px-6 py-4 bg-stone-50 border-t border-stone-100">
                            <form method="POST" action="?/update" enctype="multipart/form-data" use:enhance class="flex flex-wrap items-end gap-3">
                                <input type="hidden" name="id" value={cat.id} />
                                <div>
                                    <label class="block text-xs font-medium text-stone-500 mb-1">Name</label>
                                    <input name="name" value={cat.name} class="px-3 py-2 border border-stone-300 rounded-lg text-sm w-40" />
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-stone-500 mb-1">Order</label>
                                    <input name="order" type="number" value={cat.order} class="px-3 py-2 border border-stone-300 rounded-lg text-sm w-20" />
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-stone-500 mb-1">Cover Image</label>
                                    <input type="file" name="imageFile" accept="image/*"
                                        class="text-sm file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-primary-50 file:text-primary-700 file:font-medium file:text-xs"
                                    />
                                </div>
                                <button type="submit" class="px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600">
                                    Save
                                </button>
                                <button type="button" onclick={() => editingId = null} class="px-4 py-2 text-sm text-stone-500 hover:text-stone-700">
                                    Cancel
                                </button>
                            </form>
                        </div>
                    {/if}
                {/each}
            </div>
        {/if}
    </div>
</div>

