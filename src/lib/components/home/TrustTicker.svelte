<script lang="ts">
    import { Truck, RotateCcw, Shield, BadgeCheck, Star } from 'lucide-svelte';

    const items = [
        { icon: Star, text: '3,000+ Styles' },
        { icon: BadgeCheck, text: 'Genuine Quality' },
        { icon: Truck, text: 'Free Shipping' },
        { icon: RotateCcw, text: 'Easy Returns' },
        { icon: BadgeCheck, text: '3,000+ Happy Customers' },
    ];
</script>

<div class="bg-stone-50 border-y border-stone-100 overflow-hidden py-2.5">
    <div class="trust-ticker-track">
        {#each [0, 1] as _set}
            <div class="trust-ticker-content">
                {#each items as item}
                    <div class="flex items-center gap-1.5 px-4 whitespace-nowrap">
                        <item.icon size={14} class="text-primary-500 flex-shrink-0" />
                        <span class="text-xs font-medium text-stone-600">{item.text}</span>
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>

<style>
    .trust-ticker-track {
        display: flex;
        width: max-content;
        animation: ticker-scroll 20s linear infinite;
    }
    .trust-ticker-content {
        display: flex;
        flex-shrink: 0;
    }
    @keyframes ticker-scroll {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
    }
    .trust-ticker-track:hover {
        animation-play-state: paused;
    }
</style>

