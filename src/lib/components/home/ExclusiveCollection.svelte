<script lang="ts">
    import ProductCard from '$lib/components/product/ProductCard.svelte';
    import { ArrowRight } from 'lucide-svelte';

    interface Block {
        id: string;
        title: string | null;
        subtitle: string | null;
        imageUrl: string;
        linkUrl: string | null;
        linkText: string | null;
    }

    interface Props {
        banner: Block | null;
        products: any[];
        viewAllHref?: string;
    }

    let { banner = null, products = [], viewAllHref = '/collections' }: Props = $props();
</script>

<section class="py-8 md:py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-lg md:text-2xl font-bold text-center text-primary-700 uppercase tracking-wider mb-6">
            Exclusive Collection
        </h2>

        <!-- Promo Banner -->
        {#if banner}
            <a href={banner.linkUrl || '#'} class="block rounded-xl overflow-hidden mb-6 relative group">
                <img
                    src={banner.imageUrl}
                    alt={banner.title || 'Exclusive Collection'}
                    class="w-full aspect-[16/7] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    loading="lazy"
                />
                {#if banner.title || banner.linkText}
                    <div class="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center p-6 md:p-10">
                        <div>
                            {#if banner.title}
                                <p class="text-white text-xl md:text-3xl font-bold drop-shadow-lg">{banner.title}</p>
                            {/if}
                            {#if banner.subtitle}
                                <p class="text-white/90 text-sm mt-1">{banner.subtitle}</p>
                            {/if}
                            {#if banner.linkText}
                                <span class="inline-block mt-3 px-5 py-2 bg-white text-stone-900 text-xs font-bold rounded-full uppercase tracking-wide">
                                    {banner.linkText}
                                </span>
                            {/if}
                        </div>
                    </div>
                {/if}
            </a>
        {/if}

        <!-- Product Cards (horizontal scroll on mobile) -->
        {#if products.length > 0}
            <div class="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-4 scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible md:gap-4">
                {#each products as product}
                    <div class="snap-start flex-shrink-0 w-[160px] md:w-auto">
                        <ProductCard {product} />
                    </div>
                {/each}
            </div>

            <!-- View All Button -->
            <div class="mt-6 flex justify-center">
                <a
                    href={viewAllHref}
                    class="inline-flex items-center gap-2 px-10 py-3 bg-stone-900 text-white text-sm font-bold uppercase tracking-wider rounded-full hover:bg-stone-800 transition-colors"
                >
                    View All <ArrowRight size={16} />
                </a>
            </div>
        {/if}
    </div>
</section>

