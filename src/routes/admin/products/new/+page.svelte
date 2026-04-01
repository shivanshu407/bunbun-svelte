<script lang="ts">
    import { enhance } from "$app/forms";
    import { ArrowLeft, Save, Plus, Trash2 } from "lucide-svelte";

    let { data, form } = $props();
    let slug = $state("");
    let imageUrls = $state<string[]>([]);
    let uploading = $state(false);
    let fileInput = $state<HTMLInputElement | null>(null);

    async function handleFileUpload(files: FileList) {
        uploading = true;
        try {
            const formData = new FormData();
            for (const file of files) {
                formData.append("files", file);
            }
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok && data.urls) {
                imageUrls = [...imageUrls, ...data.urls];
            } else {
                alert(data.error || "Upload failed");
            }
        } catch {
            alert("Upload failed. Please try again.");
        }
        uploading = false;
    }

    let variants = $state<any[]>([
        {
            sku: "",
            size: "",
            color: "",
            colorHex: "",
            price: "",
            salePrice: "",
            stock: "0",
        },
    ]);

    function generateSlug(name: string) {
        slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }

    function addVariant() {
        variants = [
            ...variants,
            {
                sku: "",
                size: "",
                color: "",
                colorHex: "",
                price: "",
                salePrice: "",
                stock: "0",
            },
        ];
    }

    function removeVariant(idx: number) {
        variants = variants.filter((_, i) => i !== idx);
    }
</script>

<svelte:head><title>Add Product | Admin</title></svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
    <a
        href="/admin/products"
        class="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 mb-4"
    >
        <ArrowLeft size={16} /> Back to Products
    </a>
    <h1 class="text-2xl font-semibold text-stone-900 mb-6">Add New Product</h1>

    {#if form?.error}
        <div
            class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
        >
            {form.error}
        </div>
    {/if}

    <form method="POST" use:enhance class="space-y-6">
        <!-- Basic Info -->
        <div class="bg-white rounded-xl border border-stone-200 p-6">
            <h2 class="text-lg font-medium text-stone-800 mb-4">
                Basic Information
            </h2>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label
                        for="name"
                        class="block text-sm font-medium text-stone-700 mb-1"
                        >Product Name *</label
                    >
                    <input
                        id="name"
                        name="name"
                        required
                        oninput={(e) =>
                            generateSlug((e.target as HTMLInputElement).value)}
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div>
                    <label
                        for="slug"
                        class="block text-sm font-medium text-stone-700 mb-1"
                        >Slug *</label
                    >
                    <input
                        id="slug"
                        name="slug"
                        required
                        bind:value={slug}
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div class="md:col-span-2">
                    <label
                        for="description"
                        class="block text-sm font-medium text-stone-700 mb-1"
                        >Description *</label
                    >
                    <textarea
                        id="description"
                        name="description"
                        required
                        rows={4}
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    ></textarea>
                </div>
                <div class="md:col-span-2">
                    <label
                        for="shortDescription"
                        class="block text-sm font-medium text-stone-700 mb-1"
                        >Short Description</label
                    >
                    <input
                        id="shortDescription"
                        name="shortDescription"
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
            </div>
        </div>

        <!-- Category & Pricing -->
        <div class="bg-white rounded-xl border border-stone-200 p-6">
            <h2 class="text-lg font-medium text-stone-800 mb-4">
                Category & Pricing
            </h2>
            <div class="grid md:grid-cols-3 gap-4">
                <div>
                    <label
                        for="categoryId"
                        class="block text-sm font-medium text-stone-700 mb-1"
                        >Category *</label
                    >
                    <select
                        id="categoryId"
                        name="categoryId"
                        required
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">Select category</option>
                        {#each data.categories as cat}
                            <option value={cat.id}>{cat.name}</option>
                        {/each}
                    </select>
                </div>
                <div>
                    <label
                        for="basePrice"
                        class="block text-sm font-medium text-stone-700 mb-1"
                        >Base Price (₹) *</label
                    >
                    <input
                        id="basePrice"
                        name="basePrice"
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div>
                    <label
                        for="salePrice"
                        class="block text-sm font-medium text-stone-700 mb-1"
                        >Sale Price (₹)</label
                    >
                    <input
                        id="salePrice"
                        name="salePrice"
                        type="number"
                        min="0"
                        step="0.01"
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
            </div>
        </div>

        <!-- Details -->
        <div class="bg-white rounded-xl border border-stone-200 p-6">
            <h2 class="text-lg font-medium text-stone-800 mb-4">
                Product Details
            </h2>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label
                        for="fabric"
                        class="block text-sm font-medium text-stone-700 mb-1"
                        >Fabric</label
                    >
                    <input
                        id="fabric"
                        name="fabric"
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div>
                    <label
                        for="careInstructions"
                        class="block text-sm font-medium text-stone-700 mb-1"
                        >Care Instructions</label
                    >
                    <input
                        id="careInstructions"
                        name="careInstructions"
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div class="md:col-span-2 flex flex-wrap gap-5">
                    <label
                        class="flex items-center gap-2 text-sm text-stone-700"
                    >
                        <input
                            type="checkbox"
                            name="isFeatured"
                            class="rounded text-primary-500"
                        /> Featured
                    </label>
                    <label
                        class="flex items-center gap-2 text-sm text-stone-700"
                    >
                        <input
                            type="checkbox"
                            name="isTrending"
                            class="rounded text-primary-500"
                        /> Trending
                    </label>
                    <label
                        class="flex items-center gap-2 text-sm text-stone-700"
                    >
                        <input
                            type="checkbox"
                            name="isNewArrival"
                            class="rounded text-primary-500"
                        /> New Arrival
                    </label>
                    <label
                        class="flex items-center gap-2 text-sm text-stone-700"
                    >
                        <input
                            type="checkbox"
                            name="isBestseller"
                            class="rounded text-primary-500"
                        /> Bestseller
                    </label>
                </div>
            </div>
        </div>

        <!-- Images -->
        <div class="bg-white rounded-xl border border-stone-200 p-6">
            <h2 class="text-lg font-medium text-stone-800 mb-4">Images</h2>

            <!-- File Upload Area -->
            <div
                class="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer mb-4"
                role="button"
                tabindex="0"
                ondragover={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add(
                        "border-primary-400",
                        "bg-primary-50",
                    );
                }}
                ondragleave={(e) => {
                    e.currentTarget.classList.remove(
                        "border-primary-400",
                        "bg-primary-50",
                    );
                }}
                ondrop={async (e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove(
                        "border-primary-400",
                        "bg-primary-50",
                    );
                    const files = e.dataTransfer?.files;
                    if (files) await handleFileUpload(files);
                }}
                onclick={() => fileInput?.click()}
                onkeydown={(e) => {
                    if (e.key === "Enter") fileInput?.click();
                }}
            >
                <p class="text-sm text-stone-500">
                    <span class="text-primary-500 font-medium"
                        >Click to upload</span
                    > or drag & drop
                </p>
                <p class="text-xs text-stone-400 mt-1">
                    JPG, PNG, WebP, AVIF (max 5MB each)
                </p>
            </div>
            <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                class="hidden"
                bind:this={fileInput}
                onchange={async (e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files) await handleFileUpload(files);
                }}
            />

            {#if uploading}
                <div
                    class="flex items-center gap-2 text-sm text-stone-500 mb-4"
                >
                    <span
                        class="w-4 h-4 border-2 border-stone-300 border-t-primary-500 rounded-full animate-spin"
                    ></span>
                    Uploading...
                </div>
            {/if}

            <!-- Image Previews -->
            {#if imageUrls.length > 0}
                <div class="grid grid-cols-4 gap-3 mb-4">
                    {#each imageUrls as url, i}
                        <div
                            class="relative group rounded-lg overflow-hidden border border-stone-200"
                        >
                            <img
                                src={url}
                                alt="Product {i + 1}"
                                class="w-full h-24 object-cover"
                            />
                            <button
                                type="button"
                                onclick={() => {
                                    imageUrls = imageUrls.filter(
                                        (_, idx) => idx !== i,
                                    );
                                }}
                                class="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    {/each}
                </div>
            {/if}

            <!-- URL Fallback -->
            <details class="text-sm">
                <summary
                    class="text-stone-500 cursor-pointer hover:text-stone-700"
                >
                    Or paste image URLs manually
                </summary>
                <textarea
                    id="imageUrlsManual"
                    rows={2}
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                    class="w-full mt-2 px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                    onchange={(e) => {
                        const urls = (e.target as HTMLTextAreaElement).value
                            .split("\n")
                            .map((s) => s.trim())
                            .filter(Boolean);
                        imageUrls = [...imageUrls, ...urls];
                        (e.target as HTMLTextAreaElement).value = "";
                    }}
                ></textarea>
            </details>

            <!-- Hidden field to pass image URLs to the form action -->
            <input type="hidden" name="images" value={imageUrls.join("\n")} />
        </div>

        <!-- Variants -->
        <div class="bg-white rounded-xl border border-stone-200 p-6">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-medium text-stone-800">Variants</h2>
                <button
                    type="button"
                    onclick={addVariant}
                    class="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 font-medium"
                >
                    <Plus size={16} /> Add Variant
                </button>
            </div>

            <div class="space-y-3">
                {#each variants as v, i}
                    <div
                        class="grid grid-cols-7 gap-2 items-end p-3 bg-stone-50 rounded-lg"
                    >
                        <div>
                            <label class="block text-xs text-stone-500 mb-1"
                                >SKU *</label
                            >
                            <input
                                bind:value={v.sku}
                                required
                                placeholder="SKU-001"
                                class="w-full px-2 py-1.5 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label class="block text-xs text-stone-500 mb-1"
                                >Size</label
                            >
                            <input
                                bind:value={v.size}
                                placeholder="S/M/L"
                                class="w-full px-2 py-1.5 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label class="block text-xs text-stone-500 mb-1"
                                >Color</label
                            >
                            <input
                                bind:value={v.color}
                                placeholder="Red"
                                class="w-full px-2 py-1.5 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label class="block text-xs text-stone-500 mb-1"
                                >Price ₹</label
                            >
                            <input
                                bind:value={v.price}
                                type="number"
                                placeholder="999"
                                class="w-full px-2 py-1.5 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label class="block text-xs text-stone-500 mb-1"
                                >Sale ₹</label
                            >
                            <input
                                bind:value={v.salePrice}
                                type="number"
                                placeholder="799"
                                class="w-full px-2 py-1.5 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label class="block text-xs text-stone-500 mb-1"
                                >Stock</label
                            >
                            <input
                                bind:value={v.stock}
                                type="number"
                                placeholder="0"
                                class="w-full px-2 py-1.5 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                        </div>
                        <button
                            type="button"
                            onclick={() => removeVariant(i)}
                            class="p-1.5 text-stone-400 hover:text-red-500 self-end"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                {/each}
            </div>

            <!-- Hidden field to pass variants as JSON -->
            <input
                type="hidden"
                name="variants"
                value={JSON.stringify(variants)}
            />
        </div>

        <div class="flex justify-end">
            <button
                type="submit"
                class="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors"
            >
                <Save size={18} /> Create Product
            </button>
        </div>
    </form>
</div>
