<script lang="ts">
    import {
        Package,
        ShoppingBag,
        Users,
        DollarSign,
        Tag,
        TrendingUp,
    } from "lucide-svelte";
    import { formatPrice } from "$lib/utils";

    let { data } = $props();
</script>

<svelte:head>
    <title>Admin Dashboard | BunBunClothing</title>
</svelte:head>

<div>
    <h1
        class="text-2xl font-bold font-[family-name:var(--font-heading)] text-stone-900 mb-6"
    >
        Dashboard
    </h1>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {#each [{ icon: DollarSign, label: "Revenue", value: formatPrice(data.stats.totalRevenue), color: "bg-emerald-50 text-emerald-600" }, { icon: ShoppingBag, label: "Orders", value: data.stats.totalOrders.toString(), color: "bg-blue-50 text-blue-600" }, { icon: Package, label: "Products", value: data.stats.totalProducts.toString(), color: "bg-amber-50 text-amber-600" }, { icon: Users, label: "Customers", value: data.stats.totalCustomers.toString(), color: "bg-purple-50 text-purple-600" }, { icon: Tag, label: "Active Coupons", value: data.stats.activeCoupons.toString(), color: "bg-primary-50 text-primary-600" }] as stat}
            <div class="bg-white rounded-xl border border-stone-200 p-5">
                <div class="flex items-center gap-3">
                    <div
                        class="w-10 h-10 rounded-lg flex items-center justify-center {stat.color}"
                    >
                        <stat.icon size={20} />
                    </div>
                    <div>
                        <p class="text-xs text-stone-400 font-medium">
                            {stat.label}
                        </p>
                        <p class="text-lg font-bold text-stone-900 mt-0.5">
                            {stat.value}
                        </p>
                    </div>
                </div>
            </div>
        {/each}
    </div>

    <!-- Recent Orders -->
    <div class="bg-white rounded-xl border border-stone-200">
        <div
            class="flex items-center justify-between px-6 py-4 border-b border-stone-200"
        >
            <h2
                class="text-lg font-semibold font-[family-name:var(--font-heading)] text-stone-900 flex items-center gap-2"
            >
                <TrendingUp size={20} class="text-stone-400" />
                Recent Orders
            </h2>
            <a
                href="/admin/orders"
                class="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >View All →</a
            >
        </div>

        {#if data.recentOrders.length === 0}
            <div class="py-12 text-center">
                <ShoppingBag size={40} class="mx-auto text-stone-300 mb-3" />
                <p class="text-stone-500">No orders yet</p>
            </div>
        {:else}
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-stone-50">
                        <tr>
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Order #</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Customer</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Total</th
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
                        {#each data.recentOrders as order}
                            <tr class="hover:bg-stone-50 transition-colors">
                                <td
                                    class="px-6 py-4 text-sm font-medium text-stone-800"
                                    >{order.orderNumber}</td
                                >
                                <td class="px-6 py-4 text-sm text-stone-600"
                                    >{order.user.name}</td
                                >
                                <td
                                    class="px-6 py-4 text-sm font-semibold text-stone-800"
                                    >{formatPrice(order.total)}</td
                                >
                                <td class="px-6 py-4">
                                    <span
                                        class="inline-block px-2.5 py-1 text-xs rounded-full font-medium
										{order.status === 'delivered'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : order.status === 'shipped'
                                              ? 'bg-blue-100 text-blue-700'
                                              : order.status === 'cancelled'
                                                ? 'bg-red-100 text-red-700'
                                                : order.status === 'processing'
                                                  ? 'bg-amber-100 text-amber-700'
                                                  : 'bg-stone-100 text-stone-600'}"
                                    >
                                        {order.status}
                                    </span>
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
