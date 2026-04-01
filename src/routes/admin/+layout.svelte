<script lang="ts">
    import { page } from "$app/stores";
    import {
        LayoutDashboard,
        Package,
        ShoppingBag,
        Users,
        Tag,
        Image,
        FolderTree,
        LogOut,
        Menu,
        X,
        ChevronRight,
    } from "lucide-svelte";

    let { data, children } = $props();
    let sidebarOpen = $state(false);

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
        { icon: Package, label: "Products", href: "/admin/products" },
        { icon: FolderTree, label: "Categories", href: "/admin/categories" },
        { icon: ShoppingBag, label: "Orders", href: "/admin/orders" },
        { icon: Tag, label: "Coupons", href: "/admin/coupons" },
        { icon: Image, label: "Banners", href: "/admin/banners" },
        { icon: Users, label: "Customers", href: "/admin/customers" },
    ];

    // Don't show admin layout on login page
    let isLoginPage = $derived($page.url.pathname === "/admin/login");
</script>

{#if isLoginPage}
    {@render children()}
{:else}
    <div class="flex h-screen bg-stone-100">
        <!-- Sidebar Desktop -->
        <aside class="hidden lg:flex flex-col w-64 bg-stone-900 text-white">
            <div class="px-6 py-5 border-b border-stone-800">
                <span
                    class="text-xl font-bold font-[family-name:var(--font-heading)]"
                >
                    Bun<span class="text-primary-400">Bun</span>
                    <span class="text-xs text-stone-400 ml-1">Admin</span>
                </span>
            </div>

            <nav class="flex-1 py-4 space-y-1 px-3 overflow-y-auto">
                {#each navItems as item}
                    <a
                        href={item.href}
                        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
							{$page.url.pathname === item.href
                            ? 'bg-primary-500/20 text-primary-400'
                            : 'text-stone-400 hover:text-white hover:bg-stone-800'}"
                    >
                        <item.icon size={20} />
                        {item.label}
                    </a>
                {/each}
            </nav>

            <div class="px-3 py-4 border-t border-stone-800">
                <div class="flex items-center gap-3 px-3 py-2 text-sm">
                    <div
                        class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xs"
                    >
                        {data.user?.name?.[0] ?? "A"}
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-white font-medium text-xs truncate">
                            {data.user?.name}
                        </p>
                        <p class="text-stone-500 text-xs truncate">
                            {data.user?.email}
                        </p>
                    </div>
                </div>
                <form method="POST" action="/api/auth/logout">
                    <button
                        type="submit"
                        class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-stone-400 hover:text-red-400 hover:bg-stone-800 w-full transition-colors mt-1"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </form>
            </div>
        </aside>

        <!-- Mobile Header -->
        <div
            class="lg:hidden fixed top-0 left-0 right-0 z-30 bg-stone-900 text-white px-4 py-3 flex items-center justify-between"
        >
            <button onclick={() => (sidebarOpen = true)} class="p-1"
                ><Menu size={24} /></button
            >
            <span
                class="text-lg font-bold font-[family-name:var(--font-heading)]"
                >Bun<span class="text-primary-400">Bun</span> Admin</span
            >
            <div class="w-8"></div>
        </div>

        <!-- Mobile Sidebar -->
        {#if sidebarOpen}
            <div class="fixed inset-0 z-50 lg:hidden">
                <button
                    class="absolute inset-0 bg-black/50"
                    onclick={() => (sidebarOpen = false)}
                    aria-label="Close"
                ></button>
                <div
                    class="absolute left-0 top-0 h-full w-64 bg-stone-900 text-white overflow-y-auto"
                    style="animation: slideInLeft 0.2s ease-out"
                >
                    <div
                        class="flex items-center justify-between px-4 py-4 border-b border-stone-800"
                    >
                        <span
                            class="text-lg font-bold font-[family-name:var(--font-heading)]"
                        >
                            Bun<span class="text-primary-400">Bun</span> Admin
                        </span>
                        <button onclick={() => (sidebarOpen = false)}
                            ><X size={20} class="text-stone-400" /></button
                        >
                    </div>
                    <nav class="py-4 space-y-1 px-3">
                        {#each navItems as item}
                            <a
                                href={item.href}
                                onclick={() => (sidebarOpen = false)}
                                class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
									{$page.url.pathname === item.href
                                    ? 'bg-primary-500/20 text-primary-400'
                                    : 'text-stone-400 hover:text-white hover:bg-stone-800'}"
                            >
                                <item.icon size={20} />
                                {item.label}
                                <ChevronRight
                                    size={14}
                                    class="ml-auto text-stone-600"
                                />
                            </a>
                        {/each}
                    </nav>
                </div>
            </div>
        {/if}

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto lg:pt-0 pt-14">
            <div class="p-6 md:p-8">
                {@render children()}
            </div>
        </main>
    </div>
{/if}
