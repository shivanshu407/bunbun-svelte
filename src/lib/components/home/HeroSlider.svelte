<script lang="ts">
    import { ChevronLeft, ChevronRight } from "lucide-svelte";

    type Banner = {
        id: string;
        title: string;
        subtitle: string | null;
        imageUrl: string;
        linkUrl: string | null;
        linkText: string | null;
    };

    let { banners = [] }: { banners: Banner[] } = $props();

    let current = $state(0);
    let paused = $state(false);
    let touchStartX = $state(0);

    const total = $derived(banners.length);

    function next() {
        if (total <= 1) return;
        current = (current + 1) % total;
    }

    function prev() {
        if (total <= 1) return;
        current = (current - 1 + total) % total;
    }

    function goTo(i: number) {
        current = i;
    }

    // Auto-slide every 5 seconds
    $effect(() => {
        if (paused || total <= 1) return;
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    });
</script>

{#if banners.length > 0}
    <section
        class="relative w-full overflow-hidden"
        role="region"
        aria-label="Banner slideshow"
        onmouseenter={() => (paused = true)}
        onmouseleave={() => (paused = false)}
        ontouchstart={(e) => (touchStartX = e.touches[0].clientX)}
        ontouchend={(e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? next() : prev();
            }
        }}
    >
        <!-- Slides -->
        <div class="relative w-full aspect-[16/6] md:aspect-[16/5]">
            {#each banners as banner, i}
                <div
                    class="absolute inset-0 transition-all duration-700 ease-in-out {i === current
                        ? 'opacity-100 scale-100 z-10'
                        : 'opacity-0 scale-105 z-0'}"
                >
                    {#if banner.linkUrl}
                        <a href={banner.linkUrl} class="block w-full h-full">
                            <img
                                src={banner.imageUrl}
                                alt={banner.title}
                                class="w-full h-full object-cover"
                                loading={i === 0 ? "eager" : "lazy"}
                            />
                        </a>
                    {:else}
                        <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            class="w-full h-full object-cover"
                            loading={i === 0 ? "eager" : "lazy"}
                        />
                    {/if}

                    <!-- Text overlay -->
                    <div
                        class="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent flex items-center"
                    >
                        <div
                            class="max-w-7xl mx-auto px-6 md:px-12 w-full {i === current
                                ? 'animate-slide-up'
                                : ''}"
                        >
                            <h2
                                class="text-2xl md:text-4xl lg:text-5xl font-bold text-white font-[family-name:var(--font-heading)] leading-tight max-w-lg drop-shadow-lg"
                            >
                                {banner.title}
                            </h2>
                            {#if banner.subtitle}
                                <p
                                    class="mt-2 md:mt-3 text-sm md:text-lg text-white/90 max-w-md drop-shadow"
                                >
                                    {banner.subtitle}
                                </p>
                            {/if}
                            {#if banner.linkUrl}
                                <a
                                    href={banner.linkUrl}
                                    class="inline-flex items-center gap-2 mt-4 md:mt-6 px-6 py-2.5 md:px-8 md:py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full transition-all hover:shadow-lg hover:shadow-primary-500/25 text-sm md:text-base"
                                >
                                    {banner.linkText || "Shop Now"}
                                    <ChevronRight size={18} />
                                </a>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        <!-- Arrow Controls -->
        {#if total > 1}
            <button
                onclick={prev}
                class="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-all"
                aria-label="Previous slide"
            >
                <ChevronLeft size={20} />
            </button>
            <button
                onclick={next}
                class="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-all"
                aria-label="Next slide"
            >
                <ChevronRight size={20} />
            </button>

            <!-- Dots -->
            <div
                class="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2"
            >
                {#each banners as _, i}
                    <button
                        onclick={() => goTo(i)}
                        class="h-2 rounded-full transition-all duration-300 {i === current
                            ? 'w-8 bg-white'
                            : 'w-2 bg-white/50 hover:bg-white/70'}"
                        aria-label="Go to slide {i + 1}"
                    ></button>
                {/each}
            </div>
        {/if}
    </section>
{:else}
    <!-- Fallback static hero when no banners exist in DB -->
    <section
        class="relative bg-gradient-to-br from-primary-50 via-white to-amber-50 overflow-hidden"
    >
        <div class="max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-32">
            <div class="text-center">
                <h1
                    class="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-heading)] text-stone-900 leading-tight"
                >
                    Elegance <span class="text-primary-500">Redefined</span>
                </h1>
                <p
                    class="mt-5 text-lg text-stone-600 max-w-md mx-auto leading-relaxed"
                >
                    Discover our curated collection of premium sarees, designer
                    blouses, and essentials.
                </p>
                <div class="flex flex-wrap gap-3 mt-8 justify-center">
                    <a
                        href="/collections/sarees"
                        class="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full transition-all hover:shadow-lg hover:shadow-primary-500/25"
                    >
                        Shop Now <ChevronRight size={18} />
                    </a>
                </div>
            </div>
        </div>
    </section>
{/if}
