<script lang="ts">
    import { enhance } from "$app/forms";
    import { ShoppingBag } from "lucide-svelte";
    import { formatPrice } from "$lib/utils";

    let { data, form } = $props();

    const statuses = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
    ];
</script>

<svelte:head><title>Orders | Admin</title></svelte:head>

<div>
    <h1
        class="text-2xl font-bold font-[family-name:var(--font-heading)] text-stone-900 mb-6"
    >
        Orders
    </h1>

    {#if form?.success}
        <div
            class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700"
        >
            {form.success}
        </div>
    {/if}

    <!-- Status Filter -->
    <div class="flex flex-wrap gap-2 mb-4">
        <a
            href="/admin/orders"
            class="px-3 py-1.5 text-sm rounded-full border transition-colors
				{!data.currentStatus
                ? 'bg-stone-900 text-white border-stone-900'
                : 'border-stone-300 text-stone-600 hover:border-stone-400'}"
        >
            All
        </a>
        {#each statuses as s}
            <a
                href="/admin/orders?status={s}"
                class="px-3 py-1.5 text-sm rounded-full border capitalize transition-colors
					{data.currentStatus === s
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'border-stone-300 text-stone-600 hover:border-stone-400'}"
            >
                {s}
            </a>
        {/each}
    </div>

    <div class="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {#if data.orders.length === 0}
            <div class="py-16 text-center">
                <ShoppingBag size={40} class="mx-auto text-stone-300 mb-3" />
                <p class="text-stone-500">No orders found</p>
            </div>
        {:else}
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-stone-50">
                        <tr>
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Order</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Customer</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Items</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Total</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Payment</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Status</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Date</th
                            >
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-stone-100">
                        {#each data.orders as order}
                            <tr class="hover:bg-stone-50 transition-colors">
                                <td
                                    class="px-6 py-4 text-sm font-medium text-stone-800"
                                    >{order.orderNumber}</td
                                >
                                <td class="px-6 py-4">
                                    <p class="text-sm text-stone-800">
                                        {order.user.name}
                                    </p>
                                    <p class="text-xs text-stone-400">
                                        {order.user.email}
                                    </p>
                                </td>
                                <td class="px-6 py-4 text-sm text-stone-600">
                                    {order.items.length} item{order.items
                                        .length !== 1
                                        ? "s"
                                        : ""}
                                </td>
                                <td
                                    class="px-6 py-4 text-sm font-semibold text-stone-800"
                                    >{formatPrice(order.total)}</td
                                >
                                <td class="px-6 py-4">
                                    <span
                                        class="inline-block px-2 py-0.5 text-xs rounded-full font-medium
										{order.paymentStatus === 'paid'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : order.paymentStatus === 'failed'
                                              ? 'bg-red-100 text-red-700'
                                              : 'bg-amber-100 text-amber-700'}"
                                    >
                                        {order.paymentStatus}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <form
                                        method="POST"
                                        action="?/updateStatus"
                                        use:enhance
                                        class="flex items-center"
                                    >
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={order.id}
                                        />
                                        <select
                                            name="status"
                                            onchange={(e) =>
                                                e.currentTarget.form?.requestSubmit()}
                                            class="text-xs border border-stone-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500
												{order.status === 'delivered'
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : order.status === 'shipped'
                                                  ? 'bg-blue-50 text-blue-700'
                                                  : order.status === 'cancelled'
                                                    ? 'bg-red-50 text-red-700'
                                                    : 'bg-white text-stone-700'}"
                                        >
                                            {#each statuses as s}
                                                <option
                                                    value={s}
                                                    selected={order.status ===
                                                        s}>{s}</option
                                                >
                                            {/each}
                                        </select>
                                    </form>
                                </td>
                                <td class="px-6 py-4 text-sm text-stone-500">
                                    {new Date(
                                        order.createdAt,
                                    ).toLocaleDateString("en-IN")}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    </div>
</div>
