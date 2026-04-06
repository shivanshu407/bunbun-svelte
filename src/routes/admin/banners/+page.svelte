<script lang="ts">
    import { enhance } from "$app/forms";
    import {
        Plus,
        Trash2,
        ToggleLeft,
        ToggleRight,
        Image,
        Upload,
        Eye,
    } from "lucide-svelte";

    let { data, form } = $props();
    let showForm = $state(false);
    let previewUrl = $state("");
    let uploading = $state(false);

    function handleImagePreview(e: Event) {
        const input = e.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
            previewUrl = URL.createObjectURL(file);
        }
    }
</script>

<svelte:head><title>Banners | Admin</title></svelte:head>

<div>
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1
                class="text-2xl font-bold font-[family-name:var(--font-heading)] text-stone-900"
            >
                Banner Slider
            </h1>
            <p class="text-sm text-stone-500 mt-1">
                Manage homepage hero slider images. Active banners appear on the
                storefront.
            </p>
        </div>
        <button
            onclick={() => {
                showForm = !showForm;
                previewUrl = "";
            }}
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
            <h2 class="text-lg font-medium text-stone-800 mb-4">
                Add New Banner
            </h2>
            <form
                method="POST"
                action="?/create"
                enctype="multipart/form-data"
                use:enhance={() => {
                    uploading = true;
                    return async ({ update }) => {
                        uploading = false;
                        previewUrl = "";
                        showForm = false;
                        update();
                    };
                }}
                class="space-y-4"
            >
                <!-- Image Upload -->
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-2"
                        >Banner Image *</label
                    >
                    <div class="flex items-start gap-4">
                        <label
                            class="flex-1 flex flex-col items-center justify-center h-48 border-2 border-dashed border-stone-300 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-all"
                        >
                            {#if previewUrl}
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    class="w-full h-full object-cover rounded-xl"
                                />
                            {:else}
                                <Upload
                                    size={32}
                                    class="text-stone-400 mb-2"
                                />
                                <span class="text-sm text-stone-500"
                                    >Click to upload banner image</span
                                >
                                <span class="text-xs text-stone-400 mt-1"
                                    >Recommended: 1920×600px (JPG, PNG, WebP)</span
                                >
                            {/if}
                            <input
                                type="file"
                                name="imageFile"
                                accept="image/jpeg,image/png,image/webp"
                                required
                                class="hidden"
                                onchange={handleImagePreview}
                            />
                        </label>
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label
                            class="block text-sm font-medium text-stone-700 mb-1"
                            >Title *</label
                        >
                        <input
                            name="title"
                            required
                            placeholder="e.g. Summer Sale — 50% Off"
                            class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-stone-700 mb-1"
                            >Subtitle</label
                        >
                        <input
                            name="subtitle"
                            placeholder="e.g. Shop the latest collection"
                            class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-stone-700 mb-1"
                            >Link URL</label
                        >
                        <input
                            name="linkUrl"
                            placeholder="e.g. /collections/sarees"
                            class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-stone-700 mb-1"
                            >Button Text</label
                        >
                        <input
                            name="linkText"
                            placeholder="e.g. Shop Now"
                            class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-stone-700 mb-1"
                            >Display Order</label
                        >
                        <input
                            name="order"
                            type="number"
                            value="0"
                            class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                </div>

                <div class="flex items-center gap-3 justify-end pt-2">
                    <button
                        type="button"
                        onclick={() => {
                            showForm = false;
                            previewUrl = "";
                        }}
                        class="px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-100 rounded-lg"
                        >Cancel</button
                    >
                    <button
                        type="submit"
                        disabled={uploading}
                        class="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white text-sm font-medium rounded-lg flex items-center gap-2"
                    >
                        {#if uploading}
                            <span
                                class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                            ></span>
                            Uploading...
                        {:else}
                            <Upload size={16} /> Create Banner
                        {/if}
                    </button>
                </div>
            </form>
        </div>
    {/if}

    <!-- Banner List -->
    <div class="space-y-3">
        {#if data.banners.length === 0}
            <div
                class="py-20 text-center bg-white rounded-xl border border-stone-200"
            >
                <Image size={48} class="mx-auto text-stone-300 mb-4" />
                <p class="text-stone-500 font-medium">No banners yet</p>
                <p class="text-sm text-stone-400 mt-1">
                    Add your first banner to display the hero slider on
                    homepage.
                </p>
            </div>
        {:else}
            {#each data.banners as banner, i}
                <div
                    class="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col md:flex-row"
                >
                    <!-- Image preview -->
                    <div
                        class="md:w-72 lg:w-80 aspect-video md:aspect-auto bg-stone-100 flex-shrink-0"
                    >
                        <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            class="w-full h-full object-cover"
                        />
                    </div>

                    <!-- Info -->
                    <div class="flex-1 p-4 md:p-5 flex flex-col justify-between">
                        <div>
                            <div class="flex items-start justify-between gap-3">
                                <div>
                                    <h3
                                        class="font-semibold text-stone-800"
                                    >
                                        {banner.title}
                                    </h3>
                                    {#if banner.subtitle}
                                        <p
                                            class="text-sm text-stone-500 mt-0.5"
                                        >
                                            {banner.subtitle}
                                        </p>
                                    {/if}
                                </div>
                                <span
                                    class="text-xs px-2.5 py-1 rounded-full flex-shrink-0 {banner.isActive
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-stone-100 text-stone-500'}"
                                >
                                    {banner.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>

                            {#if banner.linkUrl}
                                <p class="text-xs text-stone-400 mt-2">
                                    Links to: <span
                                        class="text-primary-600 font-medium"
                                        >{banner.linkUrl}</span
                                    >
                                </p>
                            {/if}
                        </div>

                        <div
                            class="flex items-center gap-2 mt-3 pt-3 border-t border-stone-100"
                        >
                            <span class="text-xs text-stone-400"
                                >Order: {banner.order}</span
                            >
                            <div class="ml-auto flex items-center gap-1">
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
                                        class="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-50"
                                        title={banner.isActive
                                            ? "Deactivate"
                                            : "Activate"}
                                    >
                                        {#if banner.isActive}<ToggleRight
                                                size={20}
                                                class="text-emerald-500"
                                            />{:else}<ToggleLeft
                                                size={20}
                                            />{/if}
                                    </button>
                                </form>
                                <form
                                    method="POST"
                                    action="?/delete"
                                    use:enhance
                                    onsubmit={(e) => {
                                        if (
                                            !confirm(
                                                "Delete this banner permanently?",
                                            )
                                        )
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
                                        class="p-2 text-stone-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                                        title="Delete"
                                        ><Trash2 size={16} /></button
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
