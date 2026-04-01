<script lang="ts">
    import { Facebook, Instagram, Twitter } from "lucide-svelte";
</script>

<footer class="bg-stone-900 text-stone-300">
    <!-- Main Footer -->
    <div class="max-w-7xl mx-auto px-4 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            <!-- Brand -->
            <div class="lg:col-span-2">
                <span
                    class="text-2xl font-bold font-[family-name:var(--font-heading)] text-white"
                >
                    Bun<span class="text-primary-400">Bun</span>
                </span>
                <p class="mt-3 text-sm text-stone-400 max-w-xs leading-relaxed">
                    Your one-stop shop for sarees, blouses & essentials. Premium
                    quality, affordable prices, delivered across India.
                </p>
                <div class="flex gap-3 mt-5">
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener"
                        class="p-2 bg-stone-800 hover:bg-primary-600 rounded-full transition-colors"
                        aria-label="Facebook"
                    >
                        <Facebook size={18} />
                    </a>
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener"
                        class="p-2 bg-stone-800 hover:bg-primary-600 rounded-full transition-colors"
                        aria-label="Instagram"
                    >
                        <Instagram size={18} />
                    </a>
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener"
                        class="p-2 bg-stone-800 hover:bg-primary-600 rounded-full transition-colors"
                        aria-label="Twitter"
                    >
                        <Twitter size={18} />
                    </a>
                </div>
            </div>

            <!-- Shop -->
            <div>
                <h4
                    class="text-sm font-semibold text-white uppercase tracking-wider mb-4"
                >
                    Shop
                </h4>
                <ul class="space-y-2.5">
                    <li>
                        <a
                            href="/collections/sarees"
                            class="text-sm hover:text-primary-400 transition-colors"
                            >Sarees</a
                        >
                    </li>
                    <li>
                        <a
                            href="/collections/blouses"
                            class="text-sm hover:text-primary-400 transition-colors"
                            >Blouses</a
                        >
                    </li>
                    <li>
                        <a
                            href="/collections/shapewear"
                            class="text-sm hover:text-primary-400 transition-colors"
                            >Shapewear</a
                        >
                    </li>
                    <li>
                        <a
                            href="/collections/towels"
                            class="text-sm hover:text-primary-400 transition-colors"
                            >Towels</a
                        >
                    </li>
                    <li>
                        <a
                            href="/collections/essentials"
                            class="text-sm hover:text-primary-400 transition-colors"
                            >Essentials</a
                        >
                    </li>
                </ul>
            </div>

            <!-- Customer Service -->
            <div>
                <h4
                    class="text-sm font-semibold text-white uppercase tracking-wider mb-4"
                >
                    Customer Service
                </h4>
                <ul class="space-y-2.5">
                    <li>
                        <a
                            href="/contact"
                            class="text-sm hover:text-primary-400 transition-colors"
                            >Contact Us</a
                        >
                    </li>
                    <li>
                        <a
                            href="/account/orders"
                            class="text-sm hover:text-primary-400 transition-colors"
                            >Track Order</a
                        >
                    </li>
                    <li>
                        <a
                            href="/returns"
                            class="text-sm hover:text-primary-400 transition-colors"
                            >Returns & Refunds</a
                        >
                    </li>
                    <li>
                        <a
                            href="/faq"
                            class="text-sm hover:text-primary-400 transition-colors"
                            >FAQs</a
                        >
                    </li>
                    <li>
                        <a
                            href="/size-guide"
                            class="text-sm hover:text-primary-400 transition-colors"
                            >Size Guide</a
                        >
                    </li>
                </ul>
            </div>

            <!-- Policies -->
            <div>
                <h4
                    class="text-sm font-semibold text-white uppercase tracking-wider mb-4"
                >
                    Policies
                </h4>
                <ul class="space-y-2.5">
                    <li>
                        <a
                            href="/privacy"
                            class="text-sm hover:text-primary-400 transition-colors"
                            >Privacy Policy</a
                        >
                    </li>
                    <li>
                        <a
                            href="/terms"
                            class="text-sm hover:text-primary-400 transition-colors"
                            >Terms of Service</a
                        >
                    </li>
                    <li>
                        <a
                            href="/return-policy"
                            class="text-sm hover:text-primary-400 transition-colors"
                            >Return Policy</a
                        >
                    </li>
                    <li>
                        <a
                            href="/shipping-policy"
                            class="text-sm hover:text-primary-400 transition-colors"
                            >Shipping Policy</a
                        >
                    </li>
                </ul>
            </div>
        </div>

        <!-- Newsletter -->
        <div class="border-t border-stone-800 mt-12 pt-10">
            <div class="max-w-md mx-auto text-center">
                <h4
                    class="text-lg font-semibold text-white font-[family-name:var(--font-heading)]"
                >
                    Join Our Family
                </h4>
                <p class="text-sm text-stone-400 mt-2">
                    Get 10% off your first order + exclusive deals
                </p>
                <form
                    class="flex gap-2 mt-4"
                    onsubmit={(e) => e.preventDefault()}
                >
                    <input
                        type="email"
                        placeholder="Enter your email"
                        class="flex-1 px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-full text-sm text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        class="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-full transition-colors"
                    >
                        Subscribe
                    </button>
                </form>
                <p class="text-xs text-stone-500 mt-2">
                    We respect your privacy.
                </p>
            </div>
        </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-stone-800">
        <div
            class="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
            <p class="text-xs text-stone-500">
                © 2026 BunBunClothing. All rights reserved.
            </p>
            <div class="flex items-center gap-3 text-xs text-stone-500">
                <span>💳 We Accept:</span>
                <span>Visa</span>
                <span>•</span>
                <span>Mastercard</span>
                <span>•</span>
                <span>UPI</span>
                <span>•</span>
                <span>Razorpay</span>
            </div>
        </div>
    </div>
</footer>
