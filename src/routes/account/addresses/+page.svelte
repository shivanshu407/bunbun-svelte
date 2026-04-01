<script lang="ts">
    import { enhance } from "$app/forms";
    import { MapPin, Plus, Trash2, Star } from "lucide-svelte";

    let { data, form } = $props();
    let showForm = $state(false);
</script>

<svelte:head><title>Addresses | BunBunClothing</title></svelte:head>

<div>
    <div class="flex items-center justify-between mb-4">
        <h2
            class="text-xl font-semibold font-[family-name:var(--font-heading)] text-stone-900"
        >
            My Addresses
        </h2>
        <button
            onclick={() => (showForm = !showForm)}
            class="flex items-center gap-1.5 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg"
        >
            <Plus size={16} /> Add
        </button>
    </div>

    {#if form?.success}
        <div
            class="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700"
        >
            {form.success}
        </div>
    {/if}

    {#if showForm}
        <form
            method="POST"
            action="?/add"
            use:enhance={() => {
                return async ({ update }) => {
                    showForm = false;
                    await update();
                };
            }}
            class="bg-white rounded-xl border border-stone-200 p-6 mb-6"
        >
            <h3 class="text-lg font-medium text-stone-800 mb-4">New Address</h3>
            <div class="grid md:grid-cols-2 gap-3">
                <input
                    name="name"
                    required
                    placeholder="Full Name"
                    class="px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                    name="phone"
                    required
                    placeholder="Phone Number"
                    class="px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                    name="line1"
                    required
                    placeholder="Address Line 1"
                    class="md:col-span-2 px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                    name="line2"
                    placeholder="Address Line 2"
                    class="md:col-span-2 px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                    name="city"
                    required
                    placeholder="City"
                    class="px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                    name="state"
                    required
                    placeholder="State"
                    class="px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                    name="pincode"
                    required
                    placeholder="Pincode"
                    pattern="[0-9]{6}"
                    class="px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <select
                    name="type"
                    class="px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="home">Home</option>
                    <option value="office">Office</option>
                    <option value="other">Other</option>
                </select>
                <div class="md:col-span-2 flex items-center justify-between">
                    <label
                        class="flex items-center gap-2 text-sm text-stone-600"
                    >
                        <input
                            type="checkbox"
                            name="isDefault"
                            class="rounded"
                        /> Set as default
                    </label>
                    <div class="flex gap-2">
                        <button
                            type="button"
                            onclick={() => (showForm = false)}
                            class="px-4 py-2 text-sm text-stone-600 hover:text-stone-800"
                            >Cancel</button
                        >
                        <button
                            type="submit"
                            class="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg"
                            >Save</button
                        >
                    </div>
                </div>
            </div>
        </form>
    {/if}

    {#if data.addresses.length === 0 && !showForm}
        <div
            class="text-center py-16 bg-white rounded-xl border border-stone-200"
        >
            <MapPin size={48} class="mx-auto text-stone-300 mb-4" />
            <h3 class="text-lg font-medium text-stone-700">
                No saved addresses
            </h3>
            <p class="text-sm text-stone-400 mt-1">
                Add an address for faster checkout
            </p>
        </div>
    {:else}
        <div class="grid md:grid-cols-2 gap-4">
            {#each data.addresses as addr}
                <div
                    class="bg-white rounded-xl border border-stone-200 p-5 relative {addr.isDefault
                        ? 'ring-2 ring-primary-200'
                        : ''}"
                >
                    {#if addr.isDefault}
                        <span
                            class="absolute top-3 right-3 px-2 py-0.5 text-xs bg-primary-100 text-primary-600 rounded-full"
                            >Default</span
                        >
                    {/if}
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-sm font-medium text-stone-800"
                            >{addr.name}</span
                        >
                        <span
                            class="text-xs px-2 py-0.5 bg-stone-100 rounded-full text-stone-500 capitalize"
                            >{addr.type}</span
                        >
                    </div>
                    <p class="text-sm text-stone-600">
                        {addr.line1}{addr.line2 ? ", " + addr.line2 : ""}
                    </p>
                    <p class="text-sm text-stone-600">
                        {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p class="text-xs text-stone-400 mt-1">{addr.phone}</p>
                    <div
                        class="flex items-center gap-2 mt-3 pt-3 border-t border-stone-100"
                    >
                        {#if !addr.isDefault}
                            <form
                                method="POST"
                                action="?/setDefault"
                                use:enhance
                            >
                                <input
                                    type="hidden"
                                    name="id"
                                    value={addr.id}
                                />
                                <button
                                    type="submit"
                                    class="flex items-center gap-1 text-xs text-stone-500 hover:text-primary-500"
                                >
                                    <Star size={12} /> Set Default
                                </button>
                            </form>
                        {/if}
                        <form
                            method="POST"
                            action="?/delete"
                            use:enhance
                            onsubmit={(e) => {
                                if (!confirm("Delete this address?"))
                                    e.preventDefault();
                            }}
                        >
                            <input type="hidden" name="id" value={addr.id} />
                            <button
                                type="submit"
                                class="flex items-center gap-1 text-xs text-stone-500 hover:text-red-500"
                            >
                                <Trash2 size={12} /> Delete
                            </button>
                        </form>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
