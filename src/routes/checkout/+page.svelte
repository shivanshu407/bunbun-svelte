<script lang="ts">
    import { enhance } from "$app/forms";
    import {
        MapPin,
        Plus,
        CreditCard,
        Truck,
        ShieldCheck,
        Package,
    } from "lucide-svelte";
    import { formatPrice } from "$lib/utils";

    let { data, form } = $props();
    let showAddressForm = $state(false);
    let selectedAddressId = $state(data.addresses[0]?.id ?? "");
    let paymentMethod = $state("cod");
    let placing = $state(false);
</script>

<svelte:head><title>Checkout | BunBunClothing</title></svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8 md:py-12">
    <h1
        class="text-2xl md:text-3xl font-semibold font-[family-name:var(--font-heading)] text-stone-900 mb-8"
    >
        Checkout
    </h1>

    {#if form?.error}
        <div
            class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
        >
            {form.error}
        </div>
    {/if}

    <div class="grid lg:grid-cols-3 gap-8">
        <!-- Left: Address & Payment -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Delivery Address -->
            <div class="bg-white rounded-xl border border-stone-200 p-6">
                <div class="flex items-center justify-between mb-4">
                    <h2
                        class="text-lg font-semibold flex items-center gap-2 text-stone-900"
                    >
                        <MapPin size={20} class="text-rose-500" /> Delivery Address
                    </h2>
                    <button
                        onclick={() => (showAddressForm = !showAddressForm)}
                        class="flex items-center gap-1 text-sm text-rose-500 hover:text-rose-600 font-medium"
                    >
                        <Plus size={16} /> Add New
                    </button>
                </div>

                {#if showAddressForm}
                    <form
                        method="POST"
                        action="?/saveAddress"
                        use:enhance={() => {
                            return async ({ update }) => {
                                showAddressForm = false;
                                await update();
                            };
                        }}
                        class="grid md:grid-cols-2 gap-3 mb-4 p-4 bg-stone-50 rounded-lg"
                    >
                        <input
                            name="name"
                            required
                            placeholder="Full Name"
                            class="px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                        <input
                            name="phone"
                            required
                            placeholder="Phone Number"
                            class="px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                        <input
                            name="line1"
                            required
                            placeholder="Address Line 1"
                            class="md:col-span-2 px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                        <input
                            name="line2"
                            placeholder="Address Line 2 (optional)"
                            class="md:col-span-2 px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                        <input
                            name="city"
                            required
                            placeholder="City"
                            class="px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                        <input
                            name="state"
                            required
                            placeholder="State"
                            class="px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                        <input
                            name="pincode"
                            required
                            placeholder="Pincode"
                            pattern="[0-9]{6}"
                            class="px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                        <select
                            name="type"
                            class="px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                        >
                            <option value="home">Home</option>
                            <option value="office">Office</option>
                            <option value="other">Other</option>
                        </select>
                        <div
                            class="md:col-span-2 flex items-center justify-between"
                        >
                            <label
                                class="flex items-center gap-2 text-sm text-stone-600"
                            >
                                <input
                                    type="checkbox"
                                    name="isDefault"
                                    class="rounded"
                                /> Set as default
                            </label>
                            <button
                                type="submit"
                                class="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-lg"
                                >Save Address</button
                            >
                        </div>
                    </form>
                {/if}

                {#if data.addresses.length === 0 && !showAddressForm}
                    <p class="text-sm text-stone-500">
                        No saved addresses. Add one above.
                    </p>
                {:else}
                    <div class="space-y-3">
                        {#each data.addresses as addr}
                            <label
                                class="flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all
								{selectedAddressId === addr.id
                                    ? 'border-rose-500 bg-rose-50'
                                    : 'border-stone-200 hover:border-stone-300'}"
                            >
                                <input
                                    type="radio"
                                    name="selectedAddr"
                                    value={addr.id}
                                    bind:group={selectedAddressId}
                                    class="mt-1 text-rose-500"
                                />
                                <div class="flex-1">
                                    <div class="flex items-center gap-2">
                                        <span
                                            class="text-sm font-medium text-stone-800"
                                            >{addr.name}</span
                                        >
                                        <span
                                            class="text-xs px-2 py-0.5 bg-stone-100 rounded-full text-stone-500 capitalize"
                                            >{addr.type}</span
                                        >
                                        {#if addr.isDefault}<span
                                                class="text-xs px-2 py-0.5 bg-rose-100 rounded-full text-rose-600"
                                                >Default</span
                                            >{/if}
                                    </div>
                                    <p class="text-sm text-stone-600 mt-0.5">
                                        {addr.line1}{addr.line2
                                            ? ", " + addr.line2
                                            : ""}
                                    </p>
                                    <p class="text-sm text-stone-600">
                                        {addr.city}, {addr.state} - {addr.pincode}
                                    </p>
                                    <p class="text-xs text-stone-400 mt-1">
                                        {addr.phone}
                                    </p>
                                </div>
                            </label>
                        {/each}
                    </div>
                {/if}
            </div>

            <!-- Payment Method -->
            <div class="bg-white rounded-xl border border-stone-200 p-6">
                <h2
                    class="text-lg font-semibold flex items-center gap-2 text-stone-900 mb-4"
                >
                    <CreditCard size={20} class="text-rose-500" /> Payment Method
                </h2>
                <div class="space-y-3">
                    <label
                        class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all
						{paymentMethod === 'cod'
                            ? 'border-rose-500 bg-rose-50'
                            : 'border-stone-200 hover:border-stone-300'}"
                    >
                        <input
                            type="radio"
                            value="cod"
                            bind:group={paymentMethod}
                            class="text-rose-500"
                        />
                        <div class="flex-1">
                            <span class="text-sm font-medium text-stone-800"
                                >Cash on Delivery</span
                            >
                            <p class="text-xs text-stone-500 mt-0.5">
                                Pay when your order is delivered
                            </p>
                        </div>
                        <Truck size={20} class="text-stone-400" />
                    </label>
                    <label
                        class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all
						{paymentMethod === 'razorpay'
                            ? 'border-rose-500 bg-rose-50'
                            : 'border-stone-200 hover:border-stone-300'}"
                    >
                        <input
                            type="radio"
                            value="razorpay"
                            bind:group={paymentMethod}
                            class="text-rose-500"
                        />
                        <div class="flex-1">
                            <span class="text-sm font-medium text-stone-800"
                                >Pay Online</span
                            >
                            <p class="text-xs text-stone-500 mt-0.5">
                                UPI, Credit/Debit Card, Net Banking
                            </p>
                        </div>
                        <ShieldCheck size={20} class="text-stone-400" />
                    </label>
                </div>
            </div>
        </div>

        <!-- Right: Order Summary -->
        <div class="lg:col-span-1">
            <div
                class="bg-white rounded-xl border border-stone-200 p-6 sticky top-20"
            >
                <h2
                    class="text-lg font-semibold font-[family-name:var(--font-heading)] text-stone-900 mb-4"
                >
                    Order Summary
                </h2>

                <div class="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {#each data.cart.items as item}
                        <div class="flex gap-3">
                            <div
                                class="w-14 h-16 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0"
                            >
                                {#if item.product.images[0]}
                                    <img
                                        src={item.product.images[0].url}
                                        alt=""
                                        class="w-full h-full object-cover"
                                    />
                                {:else}
                                    <div
                                        class="w-full h-full flex items-center justify-center text-xl"
                                    >
                                        👗
                                    </div>
                                {/if}
                            </div>
                            <div class="flex-1 min-w-0">
                                <p
                                    class="text-sm font-medium text-stone-800 truncate"
                                >
                                    {item.product.name}
                                </p>
                                <p class="text-xs text-stone-400">
                                    {[item.variant.size, item.variant.color]
                                        .filter(Boolean)
                                        .join(" / ")} × {item.quantity}
                                </p>
                                <p
                                    class="text-sm font-semibold text-stone-900 mt-0.5"
                                >
                                    {formatPrice(
                                        (item.variant.salePrice ??
                                            item.variant.price) * item.quantity,
                                    )}
                                </p>
                            </div>
                        </div>
                    {/each}
                </div>

                <div class="border-t border-stone-200 pt-3 space-y-2 text-sm">
                    <div class="flex justify-between text-stone-600">
                        <span>Subtotal</span>
                        <span>{formatPrice(data.subtotal)}</span>
                    </div>
                    <div class="flex justify-between text-stone-600">
                        <span>Shipping</span>
                        <span
                            class={data.subtotal >= 999
                                ? "text-emerald-600"
                                : ""}
                        >
                            {data.subtotal >= 999 ? "FREE" : formatPrice(79)}
                        </span>
                    </div>
                    {#if data.subtotal < 999}
                        <p class="text-xs text-amber-600">
                            Add {formatPrice(999 - data.subtotal)} more for free
                            shipping!
                        </p>
                    {/if}
                    <div
                        class="border-t border-stone-200 pt-2 flex justify-between text-base font-bold text-stone-900"
                    >
                        <span>Total</span>
                        <span
                            >{formatPrice(
                                data.subtotal + (data.subtotal >= 999 ? 0 : 79),
                            )}</span
                        >
                    </div>
                </div>

                <form
                    method="POST"
                    action="?/placeOrder"
                    use:enhance={() => {
                        placing = true;
                        return async ({ update }) => {
                            placing = false;
                            await update();
                        };
                    }}
                >
                    <input
                        type="hidden"
                        name="addressId"
                        value={selectedAddressId}
                    />
                    <input
                        type="hidden"
                        name="paymentMethod"
                        value={paymentMethod}
                    />
                    <button
                        type="submit"
                        disabled={placing || !selectedAddressId}
                        class="mt-5 w-full py-3.5 bg-rose-500 hover:bg-rose-600 disabled:bg-stone-300 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                        {#if placing}
                            <span class="animate-spin">⏳</span> Placing Order...
                        {:else}
                            <Package size={18} /> Place Order
                        {/if}
                    </button>
                </form>

                <!-- Trust -->
                <div
                    class="mt-4 flex items-center gap-2 text-xs text-stone-400"
                >
                    <ShieldCheck size={14} />
                    <span>Your data is safe & secure</span>
                </div>
            </div>
        </div>
    </div>
</div>
