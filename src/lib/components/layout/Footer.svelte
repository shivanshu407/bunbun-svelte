<script lang="ts">
    import { Facebook, Instagram, Twitter, ChevronDown, ArrowRight } from "lucide-svelte";

    // Accordion state for mobile
    let openSections = $state<Record<string, boolean>>({});

    function toggleSection(key: string) {
        openSections = { ...openSections, [key]: !openSections[key] };
    }

    const sections = [
        {
            key: 'shop',
            title: 'INFORMATION',
            links: [
                { name: 'About Us', href: '/about' },
                { name: 'Contact Us', href: '/contact' },
                { name: 'Track Order', href: '/account/orders' },
                { name: 'FAQs', href: '/faq' },
                { name: 'Size Guide', href: '/size-guide' },
            ]
        },
        {
            key: 'service',
            title: 'CUSTOMER CARE',
            links: [
                { name: 'Returns & Refunds', href: '/returns' },
                { name: 'Shipping Policy', href: '/shipping-policy' },
                { name: 'Return Policy', href: '/return-policy' },
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
            ]
        },
        {
            key: 'contact',
            title: 'GET IN TOUCH',
            links: [
                { name: 'Email: support@bunbunclothing.com', href: 'mailto:support@bunbunclothing.com' },
                { name: 'Phone: +91 9876543210', href: 'tel:+919876543210' },
            ]
        }
    ];
</script>

<footer class="bg-[#0a1628] text-stone-300">
    <!-- Mobile: Accordion | Desktop: Grid -->
    <div class="max-w-7xl mx-auto">

        <!-- Mobile Accordion -->
        <div class="md:hidden">
            {#each sections as section}
                <div class="border-b border-stone-700/50">
                    <button
                        onclick={() => toggleSection(section.key)}
                        class="w-full flex items-center justify-between px-5 py-4 text-left"
                    >
                        <span class="text-xs font-bold text-white uppercase tracking-wider">{section.title}</span>
                        <ChevronDown
                            size={16}
                            class="text-stone-400 transition-transform duration-200 {openSections[section.key] ? 'rotate-180' : ''}"
                        />
                    </button>
                    {#if openSections[section.key]}
                        <div class="px-5 pb-4 space-y-2.5">
                            {#each section.links as link}
                                <a href={link.href} class="block text-sm text-stone-400 hover:text-primary-400 transition-colors">
                                    {link.name}
                                </a>
                            {/each}
                        </div>
                    {/if}
                </div>
            {/each}

            <!-- Newsletter (always visible on mobile) -->
            <div class="border-b border-stone-700/50">
                <button
                    onclick={() => toggleSection('newsletter')}
                    class="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                    <span class="text-xs font-bold text-white uppercase tracking-wider">SUBSCRIBE OUR NEWSLETTER</span>
                    <ChevronDown
                        size={16}
                        class="text-stone-400 transition-transform duration-200 {openSections['newsletter'] ? 'rotate-180' : ''}"
                    />
                </button>
                {#if openSections['newsletter']}
                    <div class="px-5 pb-4">
                        <form onsubmit={(e) => e.preventDefault()} class="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter email here"
                                class="flex-1 px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <button type="submit" class="p-2.5 bg-stone-700 hover:bg-primary-500 rounded-lg transition-colors" aria-label="Subscribe">
                                <ArrowRight size={18} />
                            </button>
                        </form>
                    </div>
                {/if}
            </div>
        </div>

        <!-- Desktop: Normal grid layout -->
        <div class="hidden md:block px-4 py-16">
            <div class="grid grid-cols-2 lg:grid-cols-5 gap-10">
                <!-- Brand -->
                <div class="lg:col-span-2">
                    <span class="text-2xl font-bold font-[family-name:var(--font-heading)] text-white">
                        Bun<span class="text-primary-400">Bun</span>
                    </span>
                    <p class="mt-3 text-sm text-stone-400 max-w-xs leading-relaxed">
                        Your one-stop shop for premium fashion & essentials. Quality products, affordable prices, delivered across India.
                    </p>
                    <div class="flex gap-3 mt-5">
                        <a href="https://facebook.com" target="_blank" rel="noopener" class="p-2 bg-stone-800 hover:bg-primary-600 rounded-full transition-colors" aria-label="Facebook">
                            <Facebook size={18} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener" class="p-2 bg-stone-800 hover:bg-primary-600 rounded-full transition-colors" aria-label="Instagram">
                            <Instagram size={18} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener" class="p-2 bg-stone-800 hover:bg-primary-600 rounded-full transition-colors" aria-label="Twitter">
                            <Twitter size={18} />
                        </a>
                    </div>
                </div>

                {#each sections as section}
                    <div>
                        <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">{section.title}</h4>
                        <ul class="space-y-2.5">
                            {#each section.links as link}
                                <li>
                                    <a href={link.href} class="text-sm hover:text-primary-400 transition-colors">{link.name}</a>
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/each}
            </div>

            <!-- Newsletter Desktop -->
            <div class="border-t border-stone-800 mt-12 pt-10">
                <div class="max-w-md mx-auto text-center">
                    <h4 class="text-lg font-semibold text-white font-[family-name:var(--font-heading)]">Join Our Family</h4>
                    <p class="text-sm text-stone-400 mt-2">Get 10% off your first order + exclusive deals</p>
                    <form class="flex gap-2 mt-4" onsubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            class="flex-1 px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-full text-sm text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <button type="submit" class="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-full transition-colors">
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-stone-800">
        <div class="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p class="text-xs text-stone-500">© 2026 BunBunClothing. All rights reserved.</p>
            <div class="flex items-center gap-3 text-xs text-stone-500">
                <span>💳 We Accept:</span>
                <span>Visa</span><span>•</span>
                <span>Mastercard</span><span>•</span>
                <span>UPI</span><span>•</span>
                <span>Razorpay</span>
            </div>
        </div>
    </div>
</footer>

