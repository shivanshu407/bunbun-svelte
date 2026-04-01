<script lang="ts">
    import {
        ArrowRight,
        Truck,
        RotateCcw,
        Shield,
        BadgeCheck,
    } from "lucide-svelte";
    import ProductCard from "$lib/components/product/ProductCard.svelte";
    import ImagePlaceholder from "$lib/components/ui/ImagePlaceholder.svelte";
    import { formatPrice } from "$lib/utils";

    let { data } = $props();
</script>

<svelte:head>
    <title>BunBunClothing - Sarees, Blouses & Essentials | Shop Online</title>
    <meta
        name="description"
        content="Shop the latest sarees, designer blouses, shapewear & essentials at BunBunClothing. Free shipping over ₹999. Easy returns. 100% genuine products."
    />
</svelte:head>

<!-- Hero Section -->
<section
    class="relative bg-gradient-to-br from-primary-50 via-white to-amber-50 overflow-hidden"
>
    <div class="max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div class="grid lg:grid-cols-2 gap-10 items-center">
            <div class="animate-slide-up">
                <span
                    class="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 text-sm font-medium rounded-full mb-4"
                >
                    ✨ New Collection 2026
                </span>
                <h1
                    class="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-heading)] text-stone-900 leading-tight"
                >
                    Elegance<br />
                    <span class="text-primary-500">Redefined</span>
                </h1>
                <p class="mt-5 text-lg text-stone-600 max-w-md leading-relaxed">
                    Discover our curated collection of premium sarees, designer
                    blouses, and essentials — crafted for the modern Indian
                    woman.
                </p>
                <div class="flex flex-wrap gap-3 mt-8">
                    <a
                        href="/collections/sarees"
                        class="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full transition-all hover:shadow-lg hover:shadow-primary-500/25"
                    >
                        Shop Now <ArrowRight size={18} />
                    </a>
                    <a
                        href="/collections"
                        class="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-stone-800 text-stone-800 font-medium rounded-full hover:bg-stone-800 hover:text-white transition-all"
                    >
                        View Collections
                    </a>
                </div>
            </div>
            <div class="relative hidden lg:block">
                <div
                    class="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl"
                >
                    <img
                        src="/icons/hero-banner.png"
                        alt="BunBunClothing - Elegant Indian Fashion"
                        class="w-full h-full object-cover"
                    />
                </div>
                <!-- Floating badge -->
                <div
                    class="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 animate-fade-in"
                >
                    <div class="flex items-center gap-3">
                        <div
                            class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-2xl"
                        >
                            🎉
                        </div>
                        <div>
                            <p class="text-sm font-bold text-stone-800">
                                50% OFF
                            </p>
                            <p class="text-xs text-stone-400">On all sarees</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Category Quick Links -->
<section class="py-12 md:py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4">
        <h2
            class="text-2xl md:text-3xl font-semibold font-[family-name:var(--font-heading)] text-center text-stone-900 mb-8"
        >
            Shop by Category
        </h2>
        <div
            class="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 scrollbar-hide md:grid md:grid-cols-5 md:overflow-visible"
        >
            {#each [{ name: "Sarees", icon: "/icons/category-sarees.png", href: "/collections/sarees", color: "from-primary-100 to-primary-200" }, { name: "Blouses", icon: "/icons/category-blouses.png", href: "/collections/blouses", color: "from-amber-100 to-amber-200" }, { name: "Shapewear", icon: "/icons/category-shapewear.png", href: "/collections/shapewear", color: "from-purple-100 to-purple-200" }, { name: "Towels", icon: "/icons/category-towels.png", href: "/collections/towels", color: "from-sky-100 to-sky-200" }, { name: "Essentials", icon: "/icons/category-essentials.png", href: "/collections/essentials", color: "from-emerald-100 to-emerald-200" }] as cat}
                <a
                    href={cat.href}
                    class="snap-center flex-shrink-0 group flex flex-col items-center gap-3 w-28 md:w-auto"
                >
                    <div
                        class="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br {cat.color} rounded-full flex items-center justify-center overflow-hidden group-hover:scale-110 group-hover:shadow-lg transition-all duration-300"
                    >
                        <img
                            src={cat.icon}
                            alt={cat.name}
                            class="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full"
                        />
                    </div>
                    <span
                        class="text-sm font-medium text-stone-700 group-hover:text-primary-600 transition-colors"
                    >
                        {cat.name}
                    </span>
                </a>
            {/each}
        </div>
    </div>
</section>

<!-- Trending Products -->
<section class="py-12 md:py-16 bg-stone-50">
    <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
            <h2
                class="text-2xl md:text-3xl font-semibold font-[family-name:var(--font-heading)] text-stone-900"
            >
                Trending Now 🔥
            </h2>
            <a
                href="/collections/sarees"
                class="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
            >
                View All <ArrowRight size={16} />
            </a>
        </div>
        <div
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
            {#each data.trending as product}
                <ProductCard {product} />
            {:else}
                <p class="col-span-full text-center text-stone-400 py-12">
                    No products available yet
                </p>
            {/each}
        </div>
    </div>
</section>

<!-- Promotional Banner -->
<section class="py-12 md:py-16">
    <div class="max-w-7xl mx-auto px-4">
        <div
            class="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl md:rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden"
        >
            <div class="absolute inset-0 opacity-10">
                <div
                    class="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"
                ></div>
                <div
                    class="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"
                ></div>
            </div>
            <div class="relative z-10">
                <p
                    class="text-sm font-medium text-primary-200 uppercase tracking-wider"
                >
                    Limited Time Offer
                </p>
                <h2
                    class="text-3xl md:text-4xl font-bold font-[family-name:var(--font-heading)] mt-3"
                >
                    FLAT 50% OFF on All Silk Sarees!
                </h2>
                <p class="mt-3 text-primary-100 text-lg">
                    Use code: <span
                        class="code font-bold bg-white/20 px-3 py-1 rounded-md"
                        >BUNBUN50</span
                    >
                </p>
                <a
                    href="/collections/sarees?tag=silk"
                    class="inline-flex items-center gap-2 mt-6 px-8 py-3.5 bg-white text-primary-600 font-semibold rounded-full hover:bg-primary-50 transition-all hover:shadow-lg"
                >
                    Shop Sale <ArrowRight size={18} />
                </a>
            </div>
        </div>
    </div>
</section>

<!-- Bestsellers -->
<section class="py-12 md:py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
            <h2
                class="text-2xl md:text-3xl font-semibold font-[family-name:var(--font-heading)] text-stone-900"
            >
                Bestsellers ⭐
            </h2>
            <a
                href="/collections/sarees"
                class="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
            >
                View All <ArrowRight size={16} />
            </a>
        </div>
        <div
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
            {#each data.bestsellers as product}
                <ProductCard {product} />
            {:else}
                <p class="col-span-full text-center text-stone-400 py-12">
                    No products available yet
                </p>
            {/each}
        </div>
    </div>
</section>

<!-- Trust Indicators -->
<section class="py-10 md:py-14 bg-stone-50">
    <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {#each [{ icon: Truck, text: "Free Shipping", sub: "On orders over ₹999" }, { icon: RotateCcw, text: "Easy Returns", sub: "7-day return policy" }, { icon: Shield, text: "Secure Payments", sub: "SSL encrypted checkout" }, { icon: BadgeCheck, text: "100% Genuine", sub: "Quality guaranteed" }] as item}
                <div
                    class="flex flex-col items-center text-center gap-3 p-5 bg-white rounded-xl shadow-sm"
                >
                    <div
                        class="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-500"
                    >
                        <item.icon size={24} />
                    </div>
                    <div>
                        <p class="text-sm font-semibold text-stone-800">
                            {item.text}
                        </p>
                        <p class="text-xs text-stone-400 mt-0.5">{item.sub}</p>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<!-- Testimonials -->
<section class="py-12 md:py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4">
        <h2
            class="text-2xl md:text-3xl font-semibold font-[family-name:var(--font-heading)] text-center text-stone-900 mb-10"
        >
            What Our Customers Say 💬
        </h2>
        <div class="grid md:grid-cols-3 gap-6">
            {#each [{ name: "Priya Sharma", location: "Mumbai, Maharashtra", text: "The silk saree quality is absolutely stunning! The colors are vibrant and the fabric feels luxurious. Will definitely order again." }, { name: "Anita Gupta", location: "Delhi, NCR", text: "Best shapewear I have found online. Comfortable, fits perfectly under my saree, and the delivery was super fast!" }, { name: "Meera Patel", location: "Ahmedabad, Gujarat", text: "Love the blouse collection! Ready-made blouses that actually fit well. The customer service team was very helpful too." }] as testimonial}
                <div
                    class="bg-stone-50 rounded-2xl p-6 hover:shadow-md transition-all"
                >
                    <div class="flex items-center gap-1 mb-3">
                        {#each Array(5) as _}
                            <span class="text-amber-400">★</span>
                        {/each}
                    </div>
                    <p class="text-sm text-stone-600 leading-relaxed italic">
                        "{testimonial.text}"
                    </p>
                    <div class="flex items-center gap-3 mt-5">
                        <div
                            class="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm"
                        >
                            {testimonial.name[0]}
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-stone-800">
                                {testimonial.name}
                            </p>
                            <p class="text-xs text-stone-400">
                                {testimonial.location}
                            </p>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>
