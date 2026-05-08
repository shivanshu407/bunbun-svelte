<script lang="ts">
    import { ArrowRight } from "lucide-svelte";
    import ProductCard from "$lib/components/product/ProductCard.svelte";
    import HeroSlider from "$lib/components/home/HeroSlider.svelte";
    import TrustTicker from "$lib/components/home/TrustTicker.svelte";
    import CategoryGrid from "$lib/components/home/CategoryGrid.svelte";
    import PaymentStrip from "$lib/components/home/PaymentStrip.svelte";
    import StoreBentoGrid from "$lib/components/home/StoreBentoGrid.svelte";
    import FeaturedVideoSlider from "$lib/components/home/FeaturedVideoSlider.svelte";
    import ExclusiveCollection from "$lib/components/home/ExclusiveCollection.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <title>BunBunClothing - Shop Online | Premium Fashion & Essentials</title>
    <meta
        name="description"
        content="Shop the latest fashion, designer blouses, shapewear & essentials at BunBunClothing. Free shipping over ₹999. Easy returns. 100% genuine products."
    />
</svelte:head>

<!-- ════════════════════════════════════════════════ -->
<!-- 1. CATEGORY PILLS (Before Hero) -->
<!-- ════════════════════════════════════════════════ -->
{#if data.categories.length > 0}
    <section class="bg-white py-3 border-b border-stone-100">
        <div class="flex overflow-x-auto snap-x snap-mandatory gap-3 px-4 scrollbar-hide">
            {#each data.categories as cat}
                <a
                    href="/collections/{cat.slug}"
                    class="snap-start flex-shrink-0 group"
                >
                    <div class="w-[94px] h-[63px] md:w-[100px] md:h-[68px] rounded-xl overflow-hidden border-2 border-stone-100 group-hover:border-primary-300 transition-colors">
                        {#if cat.image}
                            <img
                                src={cat.image}
                                alt={cat.name}
                                class="w-full h-full object-cover"
                                loading="lazy"
                            />
                        {:else}
                            <div class="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                                <span class="text-primary-600 text-sm font-bold">{cat.name[0]}</span>
                            </div>
                        {/if}
                    </div>
                    <span class="block text-[10px] md:text-xs font-semibold text-stone-700 text-center mt-1.5 max-w-[94px] truncate">
                        {cat.name}
                    </span>
                </a>
            {/each}
            <!-- Sale card — always shown as the last pill -->
            <a
                href="/collections?sale=true"
                class="snap-start flex-shrink-0 group"
            >
                <div class="w-[94px] h-[63px] md:w-[100px] md:h-[68px] rounded-xl overflow-hidden border-2 border-red-200 group-hover:border-red-400 transition-colors bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                    <span class="text-red-500 text-sm font-extrabold">%</span>
                </div>
                <span class="block text-[10px] md:text-xs font-semibold text-red-600 text-center mt-1.5 max-w-[94px] truncate">
                    Sale
                </span>
            </a>
        </div>
    </section>
{/if}


<!-- ════════════════════════════════════════════════ -->
<!-- 2. HERO BANNER (Portrait on mobile) -->
<!-- ════════════════════════════════════════════════ -->
<HeroSlider banners={data.banners} />


<!-- ════════════════════════════════════════════════ -->
<!-- 3. TRUST BADGES TICKER -->
<!-- ════════════════════════════════════════════════ -->
<TrustTicker />


<!-- ════════════════════════════════════════════════ -->
<!-- 4. PROMO COUPON BAR -->
<!-- ════════════════════════════════════════════════ -->
<div class="bg-primary-600 text-white py-2.5 px-4 text-center">
    <p class="text-xs md:text-sm font-semibold tracking-wide">
        🎉 FLAT 50% OFF | Use code: <span class="bg-white/20 px-2 py-0.5 rounded text-white font-bold ml-1">BUNBUN50</span>
    </p>
</div>


<!-- ════════════════════════════════════════════════ -->
<!-- 5. TOP CATEGORIES (2-col grid) -->
<!-- ════════════════════════════════════════════════ -->
<CategoryGrid categories={data.categories} />


<!-- ════════════════════════════════════════════════ -->
<!-- 6. PAYMENT METHODS STRIP -->
<!-- ════════════════════════════════════════════════ -->
<PaymentStrip logos={data.blocks.paymentLogos} />


<!-- ════════════════════════════════════════════════ -->
<!-- 7. TRENDING NOW -->
<!-- ════════════════════════════════════════════════ -->
<section class="py-8 md:py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-lg md:text-2xl font-bold text-center text-primary-700 uppercase tracking-wider mb-6">
            Trending Now 🔥
        </h2>

        <!-- Promo Banner -->
        {#if data.blocks.trendingBanner.length > 0}
            {@const banner = data.blocks.trendingBanner[0]}
            <a href={banner.linkUrl || '#'} class="block rounded-xl overflow-hidden mb-6 relative group">
                <img
                    src={banner.imageUrl}
                    alt={banner.title || 'Trending'}
                    class="w-full aspect-[16/7] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    loading="lazy"
                />
                {#if banner.title || banner.linkText}
                    <div class="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center p-6 md:p-10">
                        <div>
                            {#if banner.title}
                                <p class="text-white text-xl md:text-3xl font-bold font-[family-name:var(--font-heading)] drop-shadow-lg">{banner.title}</p>
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

        <!-- Product Cards (horizontal scroll on mobile, grid on desktop) -->
        <div class="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-4 scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible md:gap-4">
            {#each data.trending as product}
                <div class="snap-start flex-shrink-0 w-[160px] md:w-auto">
                    <ProductCard {product} />
                </div>
            {:else}
                <p class="col-span-full text-center text-stone-400 py-12">
                    No products available yet
                </p>
            {/each}
        </div>

        <!-- View All Button -->
        {#if data.trending.length > 0}
            <div class="mt-6 flex justify-center">
                <a
                    href="/collections?sort=trending"
                    class="inline-flex items-center gap-2 px-10 py-3 bg-stone-900 text-white text-sm font-bold uppercase tracking-wider rounded-full hover:bg-stone-800 transition-colors"
                >
                    View All <ArrowRight size={16} />
                </a>
            </div>
        {/if}
    </div>
</section>


<!-- ════════════════════════════════════════════════ -->
<!-- 8. THE BUNBUN STORE (Bento Grid) -->
<!-- ════════════════════════════════════════════════ -->
<StoreBentoGrid cards={data.blocks.storeGrid} />


<!-- ════════════════════════════════════════════════ -->
<!-- 9. FEATURED VIDEO SLIDER (Infinite Loop) -->
<!-- ════════════════════════════════════════════════ -->
<FeaturedVideoSlider videos={data.blocks.featuredCards} />


<!-- ════════════════════════════════════════════════ -->
<!-- 10. BESTSELLERS -->
<!-- ════════════════════════════════════════════════ -->
<section class="py-8 md:py-12 bg-stone-50">
    <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-lg md:text-2xl font-bold text-center text-primary-700 uppercase tracking-wider mb-6">
            Bestsellers ⭐
        </h2>

        <!-- Promo Banner -->
        {#if data.blocks.bestsellerBanner.length > 0}
            {@const banner = data.blocks.bestsellerBanner[0]}
            <a href={banner.linkUrl || '#'} class="block rounded-xl overflow-hidden mb-6 relative group">
                <img
                    src={banner.imageUrl}
                    alt={banner.title || 'Bestsellers'}
                    class="w-full aspect-[16/7] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    loading="lazy"
                />
                {#if banner.title || banner.linkText}
                    <div class="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center p-6 md:p-10">
                        <div>
                            {#if banner.title}
                                <p class="text-white text-xl md:text-3xl font-bold font-[family-name:var(--font-heading)] drop-shadow-lg">{banner.title}</p>
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

        <!-- Product Cards -->
        <div class="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-4 scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible md:gap-4">
            {#each data.bestsellers as product}
                <div class="snap-start flex-shrink-0 w-[160px] md:w-auto">
                    <ProductCard {product} />
                </div>
            {:else}
                <p class="col-span-full text-center text-stone-400 py-12">
                    No products available yet
                </p>
            {/each}
        </div>

        <!-- View All -->
        {#if data.bestsellers.length > 0}
            <div class="mt-6 flex justify-center">
                <a
                    href="/collections?sort=bestseller"
                    class="inline-flex items-center gap-2 px-10 py-3 bg-stone-900 text-white text-sm font-bold uppercase tracking-wider rounded-full hover:bg-stone-800 transition-colors"
                >
                    View All <ArrowRight size={16} />
                </a>
            </div>
        {/if}
    </div>
</section>


<!-- ════════════════════════════════════════════════ -->
<!-- 11. EXCLUSIVE COLLECTION -->
<!-- ════════════════════════════════════════════════ -->
<ExclusiveCollection
    banner={data.blocks.exclusiveBanner[0] || null}
    products={data.newArrivals}
    viewAllHref="/collections?tag=new"
/>


<!-- ════════════════════════════════════════════════ -->
<!-- 12. CUSTOMER REVIEWS -->
<!-- ════════════════════════════════════════════════ -->
<section class="py-8 md:py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-lg md:text-2xl font-bold text-center text-primary-700 uppercase tracking-wider mb-4">
            Customer Reviews 💬
        </h2>

        <!-- Aggregate Rating -->
        <div class="flex items-center justify-center gap-2 mb-8">
            <div class="flex items-center gap-0.5">
                {#each Array(5) as _, i}
                    <span class="text-lg {i < 4 ? 'text-amber-400' : 'text-amber-300'}">★</span>
                {/each}
            </div>
            <span class="text-sm font-semibold text-stone-800">4.8</span>
            <span class="text-sm text-stone-500">★ (Reviews)</span>
            <span class="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">✓ Verified</span>
        </div>

        <!-- Review Cards (horizontal scroll) -->
        <div class="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible">
            {#each [{ name: "Priya Sharma", location: "Mumbai", text: "The quality is absolutely stunning! The colors are vibrant and the fabric feels luxurious. Will definitely order again.", rating: 5 }, { name: "Anita Gupta", location: "Delhi", text: "Best shapewear I have found online. Comfortable, fits perfectly, and the delivery was super fast!", rating: 5 }, { name: "Meera Patel", location: "Ahmedabad", text: "Love the collection! Ready-made pieces that actually fit well. The customer service team was very helpful too.", rating: 5 }] as review}
                <div class="snap-start flex-shrink-0 w-[280px] md:w-auto bg-stone-50 rounded-2xl p-5 border border-stone-100">
                    <!-- Photo Placeholder -->
                    <div class="w-full aspect-[4/3] bg-stone-200 rounded-xl mb-4 flex items-center justify-center">
                        <span class="text-stone-400 text-xs">Customer Photo</span>
                    </div>

                    <p class="text-sm text-stone-600 leading-relaxed italic mb-3">
                        "{review.text}"
                    </p>

                    <div class="flex items-center gap-0.5 mb-2">
                        {#each Array(review.rating) as _}
                            <span class="text-amber-400 text-sm">★</span>
                        {/each}
                    </div>

                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center">
                            <span class="text-primary-700 text-xs font-bold">{review.name[0]}</span>
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-stone-800 flex items-center gap-1">
                                {review.name}
                                <span class="text-emerald-500 text-xs">✓</span>
                            </p>
                            <p class="text-[10px] text-stone-400">{review.location}</p>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

