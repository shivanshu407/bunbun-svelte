<script lang="ts">
    import { enhance } from '$app/forms';
    import { Trash2, Eye, EyeOff, Plus, Upload, Image, Video } from 'lucide-svelte';

    let { data, form } = $props();

    let showForm = $state(false);

    const sectionDescriptions: Record<string, string> = {
        trending_banner: 'Full-width promotional banner shown above trending products',
        store_grid: 'Image cards in the 2×2 masonry grid ("The BunBun Store")',
        featured_card: 'Video cards in the auto-scrolling featured slider (upload videos)',
        bestseller_banner: 'Full-width promotional banner shown above bestsellers',
        exclusive_banner: 'Full-width promotional banner for exclusive collection',
        payment_logo: 'Payment method logo shown in the payment strip'
    };
</script>

<svelte:head>
    <title>Homepage Blocks | Admin</title>
</svelte:head>

<div class="p-6 max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-8">
        <div>
            <h1 class="text-2xl font-bold text-stone-900">Homepage Blocks</h1>
            <p class="text-sm text-stone-500 mt-1">Manage all images and videos on the homepage</p>
        </div>
        <button
            onclick={() => showForm = !showForm}
            class="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
        >
            <Plus size={18} />
            Add Block
        </button>
    </div>

    <!-- Success / Error Messages -->
    {#if form?.success}
        <div class="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm">
            {form.success}
        </div>
    {/if}
    {#if form?.error}
        <div class="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {form.error}
        </div>
    {/if}

    <!-- Create Form -->
    {#if showForm}
        <div class="mb-8 bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
            <h2 class="text-lg font-semibold text-stone-800 mb-4">New Homepage Block</h2>
            <form method="POST" action="?/create" enctype="multipart/form-data" use:enhance class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="section" class="block text-sm font-medium text-stone-700 mb-1">Section *</label>
                        <select name="section" id="section" required
                            class="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="">Select section...</option>
                            {#each data.sections as section}
                                <option value={section}>{data.sectionLabels[section]}</option>
                            {/each}
                        </select>
                    </div>
                    <div>
                        <label for="order" class="block text-sm font-medium text-stone-700 mb-1">Order</label>
                        <input type="number" name="order" id="order" value="0"
                            class="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="title" class="block text-sm font-medium text-stone-700 mb-1">Title</label>
                        <input type="text" name="title" id="title" placeholder="Optional title text"
                            class="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label for="subtitle" class="block text-sm font-medium text-stone-700 mb-1">Subtitle</label>
                        <input type="text" name="subtitle" id="subtitle" placeholder="Optional subtitle"
                            class="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="linkUrl" class="block text-sm font-medium text-stone-700 mb-1">Link URL</label>
                        <input type="text" name="linkUrl" id="linkUrl" placeholder="/collections/trending"
                            class="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label for="linkText" class="block text-sm font-medium text-stone-700 mb-1">Link Text</label>
                        <input type="text" name="linkText" id="linkText" placeholder="Shop Now"
                            class="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label for="imageFile" class="block text-sm font-medium text-stone-700 mb-1">Image / Video *</label>
                    <input type="file" name="imageFile" id="imageFile" required
                        accept="image/*,video/*"
                        class="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-primary-50 file:text-primary-700 file:font-medium file:text-sm"
                    />
                    <p class="text-xs text-stone-400 mt-1">For "Featured Video/Card" section, upload video files (MP4). For all others, upload images.</p>
                </div>

                <div class="flex justify-end gap-3 pt-2">
                    <button type="button" onclick={() => showForm = false}
                        class="px-4 py-2 text-sm text-stone-600 hover:text-stone-800 transition-colors"
                    >Cancel</button>
                    <button type="submit"
                        class="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                    >Upload & Create</button>
                </div>
            </form>
        </div>
    {/if}

    <!-- Blocks grouped by section -->
    {#each data.sections as section}
        {@const items = data.grouped[section] || []}
        <div class="mb-8">
            <div class="flex items-center gap-3 mb-3">
                <h2 class="text-lg font-semibold text-stone-800">{data.sectionLabels[section]}</h2>
                <span class="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{items.length} items</span>
            </div>
            <p class="text-xs text-stone-400 mb-4">{sectionDescriptions[section]}</p>

            {#if items.length === 0}
                <div class="border-2 border-dashed border-stone-200 rounded-xl p-8 text-center">
                    <div class="text-stone-300 mb-2">
                        {#if section === 'featured_card'}
                            <Video size={32} class="mx-auto" />
                        {:else}
                            <Image size={32} class="mx-auto" />
                        {/if}
                    </div>
                    <p class="text-sm text-stone-400">No blocks yet. Click "Add Block" to upload.</p>
                </div>
            {:else}
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {#each items as block}
                        <div class="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm {!block.isActive ? 'opacity-50' : ''}">
                            <!-- Preview -->
                            <div class="aspect-[4/3] bg-stone-100 relative overflow-hidden">
                                {#if block.imageUrl.includes('.mp4') || block.imageUrl.includes('.webm') || block.imageUrl.includes('/video/')}
                                    <video src={block.imageUrl} class="w-full h-full object-cover" muted playsinline></video>
                                {:else}
                                    <img src={block.imageUrl} alt={block.title || 'Block'} class="w-full h-full object-cover" />
                                {/if}
                                <span class="absolute top-2 left-2 text-[10px] bg-stone-900/70 text-white px-2 py-0.5 rounded-full">
                                    #{block.order}
                                </span>
                            </div>

                            <!-- Info -->
                            <div class="p-3">
                                <p class="text-sm font-medium text-stone-800 truncate">{block.title || '(no title)'}</p>
                                {#if block.linkUrl}
                                    <p class="text-xs text-primary-500 truncate mt-0.5">{block.linkUrl}</p>
                                {/if}

                                <!-- Actions -->
                                <div class="flex items-center gap-2 mt-3">
                                    <form method="POST" action="?/toggle" use:enhance class="contents">
                                        <input type="hidden" name="id" value={block.id} />
                                        <button type="submit" class="p-1.5 text-stone-400 hover:text-stone-600 transition-colors" title={block.isActive ? 'Deactivate' : 'Activate'}>
                                            {#if block.isActive}
                                                <Eye size={16} />
                                            {:else}
                                                <EyeOff size={16} />
                                            {/if}
                                        </button>
                                    </form>
                                    <form method="POST" action="?/delete" use:enhance class="contents"
                                        onsubmit={(e) => { if (!confirm('Delete this block?')) e.preventDefault(); }}
                                    >
                                        <input type="hidden" name="id" value={block.id} />
                                        <button type="submit" class="p-1.5 text-stone-400 hover:text-red-500 transition-colors" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    {/each}
</div>

