<script lang="ts">
    import { enhance } from '$app/forms';
    import { Trash2, Eye, EyeOff, Plus, Upload, Image, Video, Pencil, X, ChevronDown, ChevronUp, Info } from 'lucide-svelte';

    let { data, form } = $props();

    let showCreateForm = $state(false);
    let editingId = $state<string | null>(null);

    // Section metadata: labels, descriptions, recommended sizes, max items
    const sectionMeta: Record<string, { label: string; desc: string; size: string; maxItems: number | null; accepts: string }> = {
        trending_banner: {
            label: 'Trending Section Banner',
            desc: 'Full-width banner displayed above trending products. Use a wide landscape image.',
            size: '1440 × 400 px (landscape)',
            maxItems: 1,
            accepts: 'image/*'
        },
        store_grid: {
            label: 'The BunBun Store Grid',
            desc: 'Image cards in the bento grid. Card #0 is the tall left card, #1 and #2 stack on the right, #3 is the full-width bottom banner.',
            size: 'Card 0: 600 × 900 px (portrait) · Cards 1–2: 600 × 450 px · Card 3: 1200 × 400 px (wide)',
            maxItems: 4,
            accepts: 'image/*'
        },
        featured_card: {
            label: 'Featured Video/Card',
            desc: 'Auto-scrolling video/image cards in the featured slider.',
            size: '400 × 600 px (portrait) · Videos: MP4 under 10 MB',
            maxItems: null,
            accepts: 'image/*,video/*'
        },
        bestseller_banner: {
            label: 'Bestsellers Section Banner',
            desc: 'Full-width banner displayed above bestseller products.',
            size: '1440 × 400 px (landscape)',
            maxItems: 1,
            accepts: 'image/*'
        },
        exclusive_banner: {
            label: 'Exclusive Collection Banner',
            desc: 'Full-width banner for the exclusive collection section.',
            size: '1440 × 400 px (landscape)',
            maxItems: 1,
            accepts: 'image/*'
        },
        payment_logo: {
            label: 'Payment Method Logo',
            desc: 'Small logo icons shown in the payment strip. Upload individual payment logos.',
            size: '120 × 40 px (transparent PNG preferred)',
            maxItems: null,
            accepts: 'image/*'
        }
    };

    function startEdit(blockId: string) {
        editingId = blockId;
    }

    function cancelEdit() {
        editingId = null;
    }

    function canAddMore(section: string): boolean {
        const meta = sectionMeta[section];
        if (!meta?.maxItems) return true;
        const current = (data.grouped[section] || []).length;
        return current < meta.maxItems;
    }
</script>

<svelte:head>
    <title>Homepage Blocks | Admin</title>
</svelte:head>

<div class="p-4 md:p-6 max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold text-stone-900">Homepage Blocks</h1>
            <p class="text-sm text-stone-500 mt-1">Manage all images, videos, and banners on the homepage</p>
        </div>
        <button
            onclick={() => showCreateForm = !showCreateForm}
            class="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
        >
            {#if showCreateForm}
                <X size={18} />
                Close
            {:else}
                <Plus size={18} />
                Add Block
            {/if}
        </button>
    </div>

    <!-- Messages -->
    {#if form?.success}
        <div class="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm">
            ✓ {form.success}
        </div>
    {/if}
    {#if form?.error}
        <div class="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            ✗ {form.error}
        </div>
    {/if}

    <!-- ──────── Create Form ──────── -->
    {#if showCreateForm}
        <div class="mb-8 bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
            <h2 class="text-lg font-semibold text-stone-800 mb-4">New Homepage Block</h2>
            <form method="POST" action="?/create" enctype="multipart/form-data" use:enhance class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="create-section" class="block text-sm font-medium text-stone-700 mb-1">Section *</label>
                        <select name="section" id="create-section" required
                            class="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="">Select section...</option>
                            {#each data.sections as section}
                                <option value={section} disabled={!canAddMore(section)}>
                                    {sectionMeta[section]?.label || section}
                                    {#if !canAddMore(section)} (max reached){/if}
                                </option>
                            {/each}
                        </select>
                    </div>
                    <div>
                        <label for="create-order" class="block text-sm font-medium text-stone-700 mb-1">Order (position)</label>
                        <input type="number" name="order" id="create-order" value="0"
                            class="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="create-title" class="block text-sm font-medium text-stone-700 mb-1">Title (optional)</label>
                        <input type="text" name="title" id="create-title" placeholder="e.g. New Arrivals"
                            class="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label for="create-subtitle" class="block text-sm font-medium text-stone-700 mb-1">Subtitle (optional)</label>
                        <input type="text" name="subtitle" id="create-subtitle" placeholder="e.g. Shop the trend"
                            class="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="create-linkUrl" class="block text-sm font-medium text-stone-700 mb-1">Link URL (optional)</label>
                        <input type="text" name="linkUrl" id="create-linkUrl" placeholder="/collections/shapewear"
                            class="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label for="create-linkText" class="block text-sm font-medium text-stone-700 mb-1">Link Text (optional)</label>
                        <input type="text" name="linkText" id="create-linkText" placeholder="Shop Now"
                            class="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label for="create-imageFile" class="block text-sm font-medium text-stone-700 mb-1">Image / Video *</label>
                    <input type="file" name="imageFile" id="create-imageFile" required
                        accept="image/*,video/*"
                        class="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-primary-50 file:text-primary-700 file:font-medium file:text-sm"
                    />
                </div>

                <div class="flex justify-end gap-3 pt-2">
                    <button type="button" onclick={() => showCreateForm = false}
                        class="px-4 py-2 text-sm text-stone-600 hover:text-stone-800 transition-colors"
                    >Cancel</button>
                    <button type="submit"
                        class="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                    >Upload & Create</button>
                </div>
            </form>
        </div>
    {/if}

    <!-- ──────── Blocks Grouped by Section ──────── -->
    {#each data.sections as section}
        {@const items = data.grouped[section] || []}
        {@const meta = sectionMeta[section]}
        <div class="mb-10">
            <!-- Section Header -->
            <div class="flex items-start justify-between mb-2">
                <div>
                    <div class="flex items-center gap-3">
                        <h2 class="text-lg font-semibold text-stone-800">{meta?.label || section}</h2>
                        <span class="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{items.length} {meta?.maxItems ? `/ ${meta.maxItems}` : ''}</span>
                    </div>
                    <p class="text-xs text-stone-400 mt-1">{meta?.desc}</p>
                </div>
            </div>
            <!-- Recommended size hint -->
            <div class="flex items-center gap-1.5 mb-4 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                <Info size={14} class="text-blue-400 flex-shrink-0" />
                <span class="text-xs text-blue-600">Recommended: <strong>{meta?.size}</strong></span>
            </div>

            {#if items.length === 0}
                <div class="border-2 border-dashed border-stone-200 rounded-xl p-8 text-center">
                    <div class="text-stone-300 mb-2">
                        {#if section === 'featured_card'}
                            <Video size={32} class="mx-auto" />
                        {:else}
                            <Image size={32} class="mx-auto" />
                        {/if}
                    </div>
                    <p class="text-sm text-stone-400">No blocks yet. Click "Add Block" above to upload.</p>
                </div>
            {:else}
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {#each items as block}
                        <div class="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm transition-opacity {!block.isActive ? 'opacity-50 ring-2 ring-red-200' : ''}">
                            <!-- Fixed preview — always 4:3 aspect, image fills via object-cover -->
                            <div class="aspect-[4/3] bg-stone-100 relative overflow-hidden">
                                {#if block.imageUrl.includes('.mp4') || block.imageUrl.includes('.webm') || block.imageUrl.includes('/video/')}
                                    <video src={block.imageUrl} class="w-full h-full object-cover" muted playsinline></video>
                                {:else}
                                    <img src={block.imageUrl} alt={block.title || 'Block'} class="w-full h-full object-cover" />
                                {/if}
                                <span class="absolute top-2 left-2 text-[10px] bg-stone-900/70 text-white px-2 py-0.5 rounded-full font-mono">
                                    #{block.order}
                                </span>
                                {#if !block.isActive}
                                    <span class="absolute top-2 right-2 text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full">
                                        Hidden
                                    </span>
                                {/if}
                            </div>

                            <!-- Info & Actions -->
                            <div class="p-3">
                                <p class="text-sm font-medium text-stone-800 truncate">{block.title || '(no title)'}</p>
                                {#if block.subtitle}
                                    <p class="text-xs text-stone-400 truncate">{block.subtitle}</p>
                                {/if}
                                {#if block.linkUrl}
                                    <p class="text-xs text-primary-500 truncate mt-0.5">→ {block.linkUrl}</p>
                                {/if}

                                <!-- Action buttons -->
                                <div class="flex items-center gap-1 mt-3 border-t border-stone-100 pt-3">
                                    <!-- Edit -->
                                    <button
                                        type="button"
                                        onclick={() => startEdit(block.id)}
                                        class="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                                        title="Edit block"
                                    >
                                        <Pencil size={13} /> Edit
                                    </button>

                                    <!-- Toggle Visibility -->
                                    <form method="POST" action="?/toggle" use:enhance class="contents">
                                        <input type="hidden" name="id" value={block.id} />
                                        <button type="submit"
                                            class="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors {block.isActive ? 'text-stone-500 hover:text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}"
                                            title={block.isActive ? 'Hide from homepage' : 'Show on homepage'}
                                        >
                                            {#if block.isActive}
                                                <EyeOff size={13} /> Hide
                                            {:else}
                                                <Eye size={13} /> Show
                                            {/if}
                                        </button>
                                    </form>

                                    <!-- Delete -->
                                    <form method="POST" action="?/delete" use:enhance class="contents ml-auto"
                                        onsubmit={(e) => { if (!confirm('Permanently delete this block? This cannot be undone.')) e.preventDefault(); }}
                                    >
                                        <input type="hidden" name="id" value={block.id} />
                                        <button type="submit"
                                            class="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                            title="Delete permanently"
                                        >
                                            <Trash2 size={13} /> Delete
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <!-- ──── Inline Edit Form (expands below card) ──── -->
                            {#if editingId === block.id}
                                <div class="border-t border-primary-200 bg-primary-50/30 p-4">
                                    <div class="flex items-center justify-between mb-3">
                                        <h3 class="text-sm font-semibold text-stone-700">Edit Block</h3>
                                        <button type="button" onclick={cancelEdit} class="text-stone-400 hover:text-stone-600">
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <form method="POST" action="?/update" enctype="multipart/form-data" use:enhance={() => {
                                        return async ({ update }) => {
                                            editingId = null;
                                            await update();
                                        };
                                    }} class="space-y-3">
                                        <input type="hidden" name="id" value={block.id} />

                                        <div class="grid grid-cols-2 gap-3">
                                            <div>
                                                <label for="edit-title-{block.id}" class="block text-[11px] font-medium text-stone-600 mb-0.5">Title</label>
                                                <input type="text" name="title" id="edit-title-{block.id}" value={block.title || ''}
                                                    placeholder="Optional title"
                                                    class="w-full px-2.5 py-1.5 border border-stone-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label for="edit-subtitle-{block.id}" class="block text-[11px] font-medium text-stone-600 mb-0.5">Subtitle</label>
                                                <input type="text" name="subtitle" id="edit-subtitle-{block.id}" value={block.subtitle || ''}
                                                    placeholder="Optional subtitle"
                                                    class="w-full px-2.5 py-1.5 border border-stone-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-2 gap-3">
                                            <div>
                                                <label for="edit-linkUrl-{block.id}" class="block text-[11px] font-medium text-stone-600 mb-0.5">Link URL</label>
                                                <input type="text" name="linkUrl" id="edit-linkUrl-{block.id}" value={block.linkUrl || ''}
                                                    placeholder="/collections/blouses"
                                                    class="w-full px-2.5 py-1.5 border border-stone-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label for="edit-linkText-{block.id}" class="block text-[11px] font-medium text-stone-600 mb-0.5">Link Text</label>
                                                <input type="text" name="linkText" id="edit-linkText-{block.id}" value={block.linkText || ''}
                                                    placeholder="Shop Now"
                                                    class="w-full px-2.5 py-1.5 border border-stone-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-2 gap-3">
                                            <div>
                                                <label for="edit-order-{block.id}" class="block text-[11px] font-medium text-stone-600 mb-0.5">Order (position)</label>
                                                <input type="number" name="order" id="edit-order-{block.id}" value={block.order}
                                                    class="w-full px-2.5 py-1.5 border border-stone-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label for="edit-imageFile-{block.id}" class="block text-[11px] font-medium text-stone-600 mb-0.5">Replace Image</label>
                                                <input type="file" name="imageFile" id="edit-imageFile-{block.id}"
                                                    accept={meta?.accepts || 'image/*'}
                                                    class="w-full px-2 py-1 border border-stone-300 rounded-md text-xs file:mr-2 file:py-0.5 file:px-2 file:rounded file:border-0 file:bg-primary-50 file:text-primary-700 file:font-medium file:text-xs"
                                                />
                                                <p class="text-[10px] text-stone-400 mt-0.5">Leave empty to keep current image</p>
                                            </div>
                                        </div>

                                        <div class="flex justify-end gap-2 pt-1">
                                            <button type="button" onclick={cancelEdit}
                                                class="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-700"
                                            >Cancel</button>
                                            <button type="submit"
                                                class="px-4 py-1.5 bg-primary-500 text-white rounded-md hover:bg-primary-600 text-xs font-medium transition-colors"
                                            >Save Changes</button>
                                        </div>
                                    </form>
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    {/each}
</div>
