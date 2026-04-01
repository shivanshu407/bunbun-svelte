<script lang="ts">
    import { page } from "$app/stores";
    import {
        User,
        Package,
        Heart,
        MapPin,
        Settings,
        LogOut,
        ChevronRight,
    } from "lucide-svelte";

    let { data, children } = $props();

    const navItems = [
        { icon: User, label: "Dashboard", href: "/account" },
        { icon: Package, label: "My Orders", href: "/account/orders" },
        { icon: Heart, label: "Wishlist", href: "/account/wishlist" },
        { icon: MapPin, label: "Addresses", href: "/account/addresses" },
        { icon: Settings, label: "Profile", href: "/account/profile" },
    ];
</script>

<div class="max-w-7xl mx-auto px-4 py-8 md:py-12">
    <!-- Welcome -->
    <div class="mb-8">
        <h1
            class="text-2xl md:text-3xl font-semibold font-[family-name:var(--font-heading)] text-stone-900"
        >
            Welcome, {data.user?.name ?? "there"}! 👋
        </h1>
        <p class="text-stone-500 mt-1">
            Manage your orders, wishlist, and account settings
        </p>
    </div>

    <div class="grid md:grid-cols-4 gap-6">
        <!-- Sidebar -->
        <div class="space-y-1">
            {#each navItems as item}
                {@const active = $page.url.pathname === item.href}
                <a
                    href={item.href}
                    class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
					{active ? 'bg-primary-50 text-primary-700' : 'text-stone-600 hover:bg-stone-50'}"
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

        <!-- Content Area -->
        <div class="md:col-span-3">
            {@render children()}
        </div>
    </div>
</div>
