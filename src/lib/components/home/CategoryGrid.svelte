<script lang="ts">
    interface Category {
        id: string;
        name: string;
        slug: string;
        image: string | null;
    }

    let { categories = [] }: { categories: Category[] } = $props();
</script>

{#if categories.length > 0}
    <section class="py-8 md:py-12 bg-white">
        <div class="max-w-7xl mx-auto px-4">
            <h2 class="text-lg md:text-2xl font-bold text-center text-primary-700 uppercase tracking-wider mb-6">
                Top Categories
            </h2>
            <div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-4">
                {#each categories as cat}
                    <a
                        href="/collections/{cat.slug}"
                        class="group block rounded-xl overflow-hidden relative aspect-[4/3] bg-stone-100"
                    >
                        {#if cat.image}
                            <img
                                src={cat.image}
                                alt={cat.name}
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                            />
                        {:else}
                            <div class="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                                <span class="text-stone-500 text-sm font-medium">{cat.name}</span>
                            </div>
                        {/if}
                        <div class="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm py-2 px-3">
                            <span class="text-xs md:text-sm font-bold text-stone-900 uppercase tracking-wide">{cat.name}</span>
                        </div>
                    </a>
                {/each}
            </div>
        </div>
    </section>
{/if}

