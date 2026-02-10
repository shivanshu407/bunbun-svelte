<script lang="ts">
    import { X, Search, ChevronRight } from "lucide-svelte";
    import { page } from "$app/stores";
    import type { UserStore } from "$lib/stores/user";

    interface Props {
        open: boolean;
        user: UserStore | null;
        onClose: () => void;
    }

    let { open, user, onClose }: Props = $props();

    const categories = [
        { name: "Sarees", href: "/collections/sarees", hasChildren: true },
        { name: "Blouses", href: "/collections/blouses", hasChildren: false },
        {
            name: "Shapewear",
            href: "/collections/shapewear",
            hasChildren: false,
        },
        { name: "Towels", href: "/collections/towels", hasChildren: false },
        {
            name: "Essentials",
            href: "/collections/essentials",
            hasChildren: false,
        },
        { name: "Sale 🔥", href: "/collections/sale", hasChildren: false },
    ];

    const accountLinks = [
        { name: "My Account", href: "/account" },
        { name: "My Orders", href: "/account/orders" },
        { name: "Wishlist", href: "/account/wishlist" },
        { name: "Track Order", href: "/account/orders" },
    ];

    const helpLinks = [
        { name: "Help & Support", href: "/help" },
        { name: "Contact Us", href: "/contact" },
    ];
</script>

<!-- Overlay -->
{#if open}
    <div class="fixed inset-0 z-50 lg:hidden">
        <!-- Backdrop -->
        <button
            class="absolute inset-0 bg-stone-900/50"
            onclick={onClose}
            aria-label="Close menu"
        ></button>

        <!-- Drawer -->
        <div
            class="absolute left-0 top-0 h-full w-[300px] max-w-[80vw] bg-white shadow-xl overflow-y-auto"
            style="animation: slideInLeft 0.25s ease-out"
        >
            <!-- Header -->
            <div
                class="flex items-center justify-between p-4 border-b border-stone-200"
            >
                <span
                    class="text-xl font-bold font-[family-name:var(--font-heading)] text-stone-900"
                >
                    Bun<span class="text-rose-500">Bun</span>
                </span>
                <button
                    onclick={onClose}
                    class="p-2 text-stone-500 hover:text-stone-700 transition-colors"
                    aria-label="Close menu"
                >
                    <X size={22} />
                </button>
            </div>

            <!-- Search -->
            <div class="p-4 border-b border-stone-100">
                <form action="/search" method="GET" class="relative">
                    <Search
                        size={16}
                        class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                    />
                    <input
                        type="text"
                        name="q"
                        placeholder="Search..."
                        class="w-full pl-9 pr-4 py-2.5 bg-stone-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                </form>
            </div>

            <!-- Categories -->
            <nav class="py-2">
                {#each categories as cat}
                    <a
                        href={cat.href}
                        onclick={onClose}
                        class="flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors
							{$page.url.pathname.startsWith(cat.href)
                            ? 'text-rose-600 bg-rose-50'
                            : 'text-stone-800 hover:bg-stone-50'}"
                    >
                        {cat.name}
                        {#if cat.hasChildren}
                            <ChevronRight size={16} class="text-stone-400" />
                        {/if}
                    </a>
                {/each}
            </nav>

            <div class="border-t border-stone-200 my-1"></div>

            <!-- Account Links -->
            <nav class="py-2">
                {#if user}
                    {#each accountLinks as link}
                        <a
                            href={link.href}
                            onclick={onClose}
                            class="block px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                        >
                            {link.name}
                        </a>
                    {/each}
                {:else}
                    <a
                        href="/login"
                        onclick={onClose}
                        class="block px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                        Login / Register
                    </a>
                {/if}
            </nav>

            <div class="border-t border-stone-200 my-1"></div>

            <!-- Help -->
            <nav class="py-2">
                {#each helpLinks as link}
                    <a
                        href={link.href}
                        onclick={onClose}
                        class="block px-4 py-3 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
                    >
                        {link.name}
                    </a>
                {/each}
            </nav>
        </div>
    </div>
{/if}
