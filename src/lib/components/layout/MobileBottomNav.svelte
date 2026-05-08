<script lang="ts">
    import { page } from '$app/stores';
    import { Menu, Diamond, Zap, User } from 'lucide-svelte';
    import { currentUser } from '$lib/stores/user';

    interface Props {
        onMenuToggle: () => void;
    }

    let { onMenuToggle }: Props = $props();

    const tabs = [
        { icon: Menu, label: 'MENU', href: null, action: 'menu' },
        { icon: Diamond, label: 'EXPLORE', href: '/collections', action: null },
        { icon: Zap, label: 'TRENDING', href: '/collections?sort=trending', action: null },
        { icon: User, label: 'ACCOUNT', href: null, action: 'account' }
    ] as const;

    function getHref(tab: typeof tabs[number]) {
        if (tab.action === 'account') return $currentUser ? '/account' : '/login';
        return tab.href;
    }

    function isActive(tab: typeof tabs[number]) {
        const path = $page.url.pathname;
        if (tab.action === 'menu') return false;
        if (tab.action === 'account') return path.startsWith('/account') || path === '/login';
        if (tab.href === '/collections') return path.startsWith('/collections') && !$page.url.searchParams.has('sort');
        return false;
    }
</script>

<nav class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200 lg:hidden" id="mobile-bottom-nav">
    <div class="flex items-center justify-around h-[64px] max-w-lg mx-auto px-2">
        {#each tabs as tab}
            {#if tab.action === 'menu'}
                <button
                    onclick={onMenuToggle}
                    class="flex flex-col items-center justify-center gap-0.5 w-16 py-1 text-stone-500 hover:text-stone-900 transition-colors"
                >
                    <tab.icon size={22} strokeWidth={1.5} />
                    <span class="text-[10px] font-semibold tracking-wide">{tab.label}</span>
                </button>
            {:else}
                {@const href = getHref(tab)}
                {@const active = isActive(tab)}
                <a
                    href={href}
                    class="flex flex-col items-center justify-center gap-0.5 w-16 py-1 transition-colors {active ? 'text-stone-900' : 'text-stone-500 hover:text-stone-900'}"
                >
                    <tab.icon size={22} strokeWidth={active ? 2 : 1.5} />
                    <span class="text-[10px] font-semibold tracking-wide">{tab.label}</span>
                </a>
            {/if}
        {/each}
    </div>
</nav>

