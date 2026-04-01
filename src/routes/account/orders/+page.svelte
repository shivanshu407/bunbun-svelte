<script lang="ts">
    import { Package, Eye, ChevronRight } from "lucide-svelte";
    import { formatPrice } from "$lib/utils";

    let { data } = $props();

    function statusColor(status: string) {
        switch (status) {
            case "delivered":
                return "bg-emerald-100 text-emerald-700";
            case "shipped":
                return "bg-blue-100 text-blue-700";
            case "processing":
            case "confirmed":
                return "bg-amber-100 text-amber-700";
            case "cancelled":
            case "returned":
                return "bg-red-100 text-red-700";
            default:
                return "bg-stone-100 text-stone-600";
        }
    }
</script>

<svelte:head><title>My Orders | BunBunClothing</title></svelte:head>

<div>
    <h2
        class="text-xl font-semibold font-[family-name:var(--font-heading)] text-stone-900 mb-4"
    >
        My Orders
    </h2>

    {#if data.orders.length === 0}
        <div
            class="text-center py-16 bg-white rounded-xl border border-stone-200"
        >
            <Package size={48} class="mx-auto text-stone-300 mb-4" />
            <h3 class="text-lg font-medium text-stone-700">No orders yet</h3>
            <p class="text-sm text-stone-400 mt-1">
                Start shopping to see your orders here
            </p>
            <a
                href="/collections/sarees"
                class="inline-block mt-4 px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-full"
            >
                Start Shopping
            </a>
        </div>
    {:else}
        <div class="space-y-4">
            {#each data.orders as order}
                <div
                    class="bg-white rounded-xl border border-stone-200 p-5 hover:shadow-md transition-shadow"
                >
                    <div
                        class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3"
                    >
                        <div>
                            <p
                                class="text-xs text-stone-400 uppercase tracking-wider"
                            >
                                Order
                            </p>
                            <p
                                class="text-sm font-bold font-[family-name:var(--font-mono)] text-stone-900"
                            >
                                {order.orderNumber}
                            </p>
                        </div>
                        <div class="flex items-center gap-3">
                            <span
                                class="px-2.5 py-1 text-xs font-medium rounded-full capitalize {statusColor(
                                    order.status,
                                )}"
                            >
                                {order.status}
                            </span>
                            <span class="text-xs text-stone-400">
                                {new Date(order.createdAt).toLocaleDateString(
                                    "en-IN",
                                    {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    },
                                )}
                            </span>
                        </div>
                    </div>

                    <div class="space-y-2 border-t border-stone-100 pt-3">
                        {#each order.items.slice(0, 3) as item}
                            <div class="flex justify-between text-sm">
                                <span class="text-stone-700">
                                    {item.productName}
                                    {#if item.variantInfo}<span
                                            class="text-stone-400"
                                        >
                                            ({item.variantInfo})</span
                                        >{/if}
                                    <span class="text-stone-400">
                                        × {item.quantity}</span
                                    >
                                </span>
                                <span class="font-medium text-stone-800"
                                    >{formatPrice(item.total)}</span
                                >
                            </div>
                        {/each}
                        {#if order.items.length > 3}
                            <p class="text-xs text-stone-400">
                                +{order.items.length - 3} more items
                            </p>
                        {/if}
                    </div>

                    <div
                        class="flex items-center justify-between mt-3 pt-3 border-t border-stone-100"
                    >
                        <span class="text-sm font-bold text-stone-900"
                            >Total: {formatPrice(order.total)}</span
                        >
                        <a
                            href="/account/orders/{order.id}"
                            class="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600 font-medium"
                        >
                            <Eye size={14} /> View Details <ChevronRight
                                size={14}
                            />
                        </a>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
