<script lang="ts">
    import { CheckCircle, Package, ArrowRight } from "lucide-svelte";
    import { formatPrice } from "$lib/utils";

    let { data } = $props();
    const addr = JSON.parse(data.order.shippingAddress);
</script>

<svelte:head><title>Order Confirmed | BunBunClothing</title></svelte:head>

<div class="max-w-2xl mx-auto px-4 py-12 md:py-20 text-center">
    <div class="animate-bounce-in">
        <CheckCircle size={64} class="mx-auto text-emerald-500 mb-4" />
        <h1
            class="text-2xl md:text-3xl font-bold font-[family-name:var(--font-heading)] text-stone-900"
        >
            Order Confirmed! 🎉
        </h1>
        <p class="text-stone-500 mt-2">
            Thank you for shopping with BunBunClothing
        </p>
    </div>

    <div class="bg-white rounded-xl border border-stone-200 p-6 mt-8 text-left">
        <div class="flex items-center justify-between mb-4">
            <div>
                <p class="text-xs text-stone-400 uppercase tracking-wider">
                    Order Number
                </p>
                <p
                    class="text-lg font-bold font-[family-name:var(--font-mono)] text-stone-900"
                >
                    {data.order.orderNumber}
                </p>
            </div>
            <span
                class="px-3 py-1 text-xs font-medium rounded-full capitalize
				{data.order.status === 'confirmed'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'}"
            >
                {data.order.status}
            </span>
        </div>

        <div class="border-t border-stone-100 pt-4 space-y-3">
            {#each data.order.items as item}
                <div class="flex justify-between text-sm">
                    <div>
                        <span class="text-stone-800">{item.productName}</span>
                        {#if item.variantInfo}
                            <span class="text-stone-400 ml-1"
                                >({item.variantInfo})</span
                            >
                        {/if}
                        <span class="text-stone-400 ml-1"
                            >× {item.quantity}</span
                        >
                    </div>
                    <span class="font-medium text-stone-800"
                        >{formatPrice(item.total)}</span
                    >
                </div>
            {/each}
        </div>

        <div class="border-t border-stone-200 mt-4 pt-3 space-y-1 text-sm">
            <div class="flex justify-between text-stone-500">
                <span>Subtotal</span><span
                    >{formatPrice(data.order.subtotal)}</span
                >
            </div>
            <div class="flex justify-between text-stone-500">
                <span>Shipping</span>
                <span
                    >{data.order.shipping === 0
                        ? "FREE"
                        : formatPrice(data.order.shipping)}</span
                >
            </div>
            <div
                class="flex justify-between font-bold text-stone-900 text-base pt-1"
            >
                <span>Total</span><span>{formatPrice(data.order.total)}</span>
            </div>
        </div>

        <div class="border-t border-stone-100 mt-4 pt-4">
            <p class="text-xs text-stone-400 uppercase tracking-wider mb-1">
                Delivering to
            </p>
            <p class="text-sm text-stone-800 font-medium">{addr.name}</p>
            <p class="text-sm text-stone-600">
                {addr.line1}{addr.line2 ? ", " + addr.line2 : ""}
            </p>
            <p class="text-sm text-stone-600">
                {addr.city}, {addr.state} - {addr.pincode}
            </p>
            <p class="text-xs text-stone-400 mt-1">{addr.phone}</p>
        </div>

        <div class="border-t border-stone-100 mt-4 pt-4 text-sm">
            <p class="text-stone-500">
                <strong>Payment:</strong>
                {data.order.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}
            </p>
        </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 justify-center mt-8">
        <a
            href="/account"
            class="px-6 py-2.5 border-2 border-stone-800 text-stone-800 text-sm font-medium rounded-full hover:bg-stone-800 hover:text-white transition-all flex items-center justify-center gap-2"
        >
            <Package size={16} /> View Orders
        </a>
        <a
            href="/collections/sarees"
            class="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-full transition-colors flex items-center justify-center gap-2"
        >
            Continue Shopping <ArrowRight size={16} />
        </a>
    </div>
</div>
