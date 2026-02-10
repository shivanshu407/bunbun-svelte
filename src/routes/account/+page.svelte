<script lang="ts">
    import {
        User,
        Package,
        Heart,
        MapPin,
        LogOut,
        ChevronRight,
    } from "lucide-svelte";
    import { formatPrice } from "$lib/utils";

    let { data } = $props();
</script>

<svelte:head>
    <title>My Account | BunBunClothing</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8 md:py-12">
    <!-- Welcome -->
    <div class="mb-8">
        <h1
            class="text-2xl md:text-3xl font-semibold font-[family-name:var(--font-heading)] text-stone-900"
        >
            Welcome, {data.user?.name}! 👋
        </h1>
        <p class="text-stone-500 mt-1">
            Manage your orders, wishlist, and account settings
        </p>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
        <!-- Sidebar -->
        <div class="space-y-2">
            {#each [{ icon: User, label: "Profile", href: "/account", active: true }, { icon: Package, label: "My Orders", href: "/account/orders", active: false }, { icon: Heart, label: "Wishlist", href: "/account/wishlist", active: false }, { icon: MapPin, label: "Addresses", href: "/account/addresses", active: false }] as item}
                <a
                    href={item.href}
                    class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
						{item.active ? 'bg-rose-50 text-rose-700' : 'text-stone-600 hover:bg-stone-50'}"
                >
                    <item.icon size={20} />
                    {item.label}
                    <ChevronRight size={16} class="ml-auto text-stone-400" />
                </a>
            {/each}

            <form method="POST" action="/api/auth/logout">
                <button
                    type="submit"
                    class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-stone-600 hover:bg-red-50 hover:text-red-600 transition-all w-full"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </form>
        </div>

        <!-- Main Content -->
        <div class="md:col-span-2 space-y-6">
            <!-- Profile Card -->
            <div class="bg-white rounded-2xl border border-stone-200 p-6">
                <h2
                    class="text-lg font-semibold font-[family-name:var(--font-heading)] text-stone-900 mb-4"
                >
                    Profile Info
                </h2>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p class="text-stone-400">Name</p>
                        <p class="font-medium text-stone-800">
                            {data.user?.name}
                        </p>
                    </div>
                    <div>
                        <p class="text-stone-400">Email</p>
                        <p class="font-medium text-stone-800">
                            {data.user?.email}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Recent Orders -->
            <div class="bg-white rounded-2xl border border-stone-200 p-6">
                <div class="flex items-center justify-between mb-4">
                    <h2
                        class="text-lg font-semibold font-[family-name:var(--font-heading)] text-stone-900"
                    >
                        Recent Orders
                    </h2>
                    <a
                        href="/account/orders"
                        class="text-sm text-rose-600 hover:text-rose-700 font-medium"
                        >View All</a
                    >
                </div>
                {#if data.recentOrders.length === 0}
                    <div class="text-center py-8">
                        <Package
                            size={40}
                            class="mx-auto text-stone-300 mb-3"
                        />
                        <p class="text-stone-500">No orders yet</p>
                        <a
                            href="/collections/sarees"
                            class="inline-block mt-3 text-sm text-rose-600 hover:text-rose-700 font-medium"
                        >
                            Start Shopping →
                        </a>
                    </div>
                {:else}
                    <div class="space-y-3">
                        {#each data.recentOrders as order}
                            <a
                                href="/account/orders/{order.id}"
                                class="flex items-center justify-between p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors"
                            >
                                <div>
                                    <p
                                        class="text-sm font-medium text-stone-800"
                                    >
                                        #{order.orderNumber}
                                    </p>
                                    <p class="text-xs text-stone-400 mt-0.5">
                                        {new Date(
                                            order.createdAt,
                                        ).toLocaleDateString("en-IN")} • {order
                                            .items.length} items
                                    </p>
                                </div>
                                <div class="text-right">
                                    <p
                                        class="text-sm font-semibold text-stone-800"
                                    >
                                        {formatPrice(order.total)}
                                    </p>
                                    <span
                                        class="inline-block px-2 py-0.5 text-xs rounded-full mt-0.5
										{order.status === 'delivered'
                                            ? 'bg-green-100 text-green-700'
                                            : order.status === 'shipped'
                                              ? 'bg-blue-100 text-blue-700'
                                              : order.status === 'cancelled'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-amber-100 text-amber-700'}"
                                    >
                                        {order.status}
                                    </span>
                                </div>
                            </a>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>
