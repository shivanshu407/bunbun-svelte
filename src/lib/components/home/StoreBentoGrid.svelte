<script lang="ts">
    import { ImagePlus } from 'lucide-svelte';

    interface Block {
        id: string;
        title: string | null;
        subtitle: string | null;
        imageUrl: string;
        linkUrl: string | null;
        linkText: string | null;
    }

    let { cards = [] }: { cards: Block[] } = $props();

    // Placeholder cards when admin hasn't uploaded yet
    const placeholders = [
        { title: 'Collection 1' },
        { title: 'Collection 2' },
        { title: 'Collection 3' },
        { title: 'Collection 4' },
    ];
</script>

<section class="py-8 md:py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-lg md:text-2xl font-bold text-center text-primary-700 uppercase tracking-wider mb-6">
            The BunBun Store
        </h2>

        <!-- Bento: left col = 1 tall card, right col = 2 stacked square cards + 1 square below -->
        <div class="bento-grid">
            {#if cards.length > 0}
                {#each cards as card, i}
                    <a
                        href={card.linkUrl || '#'}
                        class="group block rounded-xl overflow-hidden relative bg-stone-100 bento-{i}"
                    >
                        <img
                            src={card.imageUrl}
                            alt={card.title || 'Collection'}
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                        />
                        {#if card.title}
                            <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-3 md:p-4">
                                <span class="text-white font-bold text-sm md:text-base drop-shadow-lg uppercase">{card.title}</span>
                            </div>
                        {/if}
                    </a>
                {/each}
            {:else}
                {#each placeholders as ph, i}
                    <div
                        class="rounded-xl overflow-hidden relative bg-gradient-to-br from-stone-100 to-stone-200 flex flex-col items-center justify-center gap-2 bento-{i}"
                    >
                        <ImagePlus size={28} class="text-stone-300" />
                        <span class="text-xs font-semibold text-stone-400 uppercase">{ph.title}</span>
                        <span class="text-[10px] text-stone-300">Upload from Admin → Homepage</span>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
</section>

<style>
    .bento-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 12px;
    }

    /* Card 0: tall left card spanning both rows */
    :global(.bento-0) {
        grid-column: 1;
        grid-row: 1 / 3;
    }
    /* Card 1: top-right */
    :global(.bento-1) {
        grid-column: 2;
        grid-row: 1;
    }
    /* Card 2: bottom-right */
    :global(.bento-2) {
        grid-column: 2;
        grid-row: 2;
    }
    /* Card 3: full-width below */
    :global(.bento-3) {
        grid-column: 1 / 3;
        grid-row: 3;
        aspect-ratio: 16 / 7;
    }

    @media (min-width: 768px) {
        .bento-grid {
            gap: 16px;
        }
    }
</style>
