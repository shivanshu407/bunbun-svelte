<script lang="ts">
    import { enhance } from "$app/forms";
    import { Plus, Trash2, ToggleLeft, ToggleRight, Tag } from "lucide-svelte";

    let { data, form } = $props();
    let showForm = $state(false);
</script>

<svelte:head><title>Coupons | Admin</title></svelte:head>

<div>
    <div class="flex items-center justify-between mb-6">
        <h1
            class="text-2xl font-bold font-[family-name:var(--font-heading)] text-stone-900"
        >
            Coupons
        </h1>
        <button
            onclick={() => (showForm = !showForm)}
            class="flex items-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
            <Plus size={18} /> New Coupon
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

    <!-- Create Form -->
    {#if showForm}
        <div
            class="bg-white rounded-xl border border-stone-200 p-6 mb-6 animate-fade-in"
        >
            <h2 class="text-lg font-semibold text-stone-900 mb-4">
                Create Coupon
            </h2>
            <form
                method="POST"
                action="?/create"
                use:enhance
                class="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1"
                        >Code *</label
                    >
                    <input
                        name="code"
                        required
                        placeholder="e.g. BUNBUN50"
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm uppercase focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1"
                        >Description</label
                    >
                    <input
                        name="description"
                        placeholder="50% off on all products"
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1"
                        >Type *</label
                    >
                    <select
                        name="type"
                        required
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1"
                        >Value *</label
                    >
                    <input
                        name="value"
                        type="number"
                        step="0.01"
                        required
                        placeholder="50"
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1"
                        >Min Order Amount</label
                    >
                    <input
                        name="minOrderAmount"
                        type="number"
                        step="0.01"
                        placeholder="999"
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1"
                        >Max Discount</label
                    >
                    <input
                        name="maxDiscount"
                        type="number"
                        step="0.01"
                        placeholder="500"
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1"
                        >Usage Limit</label
                    >
                    <input
                        name="usageLimit"
                        type="number"
                        placeholder="100"
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                </div>
                <div></div>
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1"
                        >Valid From *</label
                    >
                    <input
                        name="validFrom"
                        type="date"
                        required
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1"
                        >Valid To *</label
                    >
                    <input
                        name="validTo"
                        type="date"
                        required
                        class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                </div>
                <div class="md:col-span-2 flex gap-3 justify-end mt-2">
                    <button
                        type="button"
                        onclick={() => (showForm = false)}
                        class="px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        Create Coupon
                    </button>
                </div>
            </form>
        </div>
    {/if}

    <!-- Coupons Table -->
    <div class="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {#if data.coupons.length === 0}
            <div class="py-16 text-center">
                <Tag size={40} class="mx-auto text-stone-300 mb-3" />
                <p class="text-stone-500">No coupons created yet</p>
            </div>
        {:else}
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-stone-50">
                        <tr>
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Code</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Discount</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Min Order</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Used</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Valid Until</th
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
                        {#each data.coupons as coupon}
                            <tr class="hover:bg-stone-50 transition-colors">
                                <td class="px-6 py-4">
                                    <span
                                        class="code text-sm font-bold text-stone-800 bg-stone-100 px-2 py-1 rounded"
                                        >{coupon.code}</span
                                    >
                                </td>
                                <td class="px-6 py-4 text-sm text-stone-600">
                                    {coupon.type === "percentage"
                                        ? `${coupon.value}%`
                                        : `₹${coupon.value}`}
                                </td>
                                <td class="px-6 py-4 text-sm text-stone-600">
                                    {coupon.minOrderAmount
                                        ? `₹${coupon.minOrderAmount}`
                                        : "—"}
                                </td>
                                <td class="px-6 py-4 text-sm text-stone-600">
                                    {coupon._count.orders}{coupon.usageLimit
                                        ? `/${coupon.usageLimit}`
                                        : ""}
                                </td>
                                <td class="px-6 py-4 text-sm text-stone-500">
                                    {new Date(
                                        coupon.validTo,
                                    ).toLocaleDateString("en-IN")}
                                </td>
                                <td class="px-6 py-4">
                                    <span
                                        class="inline-block px-2 py-0.5 text-xs rounded-full font-medium
										{coupon.isActive && new Date(coupon.validTo) >= new Date()
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-stone-100 text-stone-500'}"
                                    >
                                        {coupon.isActive &&
                                        new Date(coupon.validTo) >= new Date()
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-2">
                                        <form
                                            method="POST"
                                            action="?/toggle"
                                            use:enhance
                                        >
                                            <input
                                                type="hidden"
                                                name="id"
                                                value={coupon.id}
                                            />
                                            <button
                                                type="submit"
                                                class="p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
                                                title="Toggle"
                                            >
                                                {#if coupon.isActive}
                                                    <ToggleRight
                                                        size={20}
                                                        class="text-emerald-500"
                                                    />
                                                {:else}
                                                    <ToggleLeft size={20} />
                                                {/if}
                                            </button>
                                        </form>
                                        <form
                                            method="POST"
                                            action="?/delete"
                                            use:enhance
                                            onsubmit={(e) => {
                                                if (
                                                    !confirm(
                                                        "Delete this coupon?",
                                                    )
                                                )
                                                    e.preventDefault();
                                            }}
                                        >
                                            <input
                                                type="hidden"
                                                name="id"
                                                value={coupon.id}
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
        {/if}
    </div>
</div>
