<script lang="ts">
	import { Search, User, Heart, ShoppingBag, Menu } from "lucide-svelte";
	import { cartCount, cartDrawerOpen } from "$lib/stores/cart";
	import type { UserStore } from "$lib/stores/user";

	interface Props {
		user: UserStore | null;
		onMenuToggle: () => void;
	}

	let { user, onMenuToggle }: Props = $props();
	let searchOpen = $state(false);
	let searchQuery = $state("");
	let userMenuOpen = $state(false);
</script>

<header class="bg-white border-b border-stone-200 sticky top-0 z-40">
	<div class="max-w-7xl mx-auto px-4">
		<div class="flex items-center justify-between h-16">
			<!-- Mobile: Hamburger -->
			<button
				onclick={onMenuToggle}
				class="lg:hidden p-2 -ml-2 text-stone-700 hover:text-rose-600 transition-colors"
				aria-label="Open menu"
			>
				<Menu size={24} />
			</button>

			<!-- Logo -->
			<a href="/" class="flex-shrink-0 mr-auto lg:mr-0 ml-2 lg:ml-0">
				<span
					class="text-2xl font-bold font-[family-name:var(--font-heading)] text-stone-900"
				>
					Bun<span class="text-rose-500">Bun</span>
				</span>
			</a>

			<!-- Desktop Search Bar -->
			<div class="hidden lg:flex flex-1 max-w-lg mx-8">
				<form action="/search" method="GET" class="w-full relative">
					<input
						type="text"
						name="q"
						placeholder="Search sarees, blouses, essentials..."
						bind:value={searchQuery}
						class="w-full pl-4 pr-10 py-2.5 bg-stone-100 border border-stone-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all placeholder:text-stone-400"
					/>
					<button
						type="submit"
						class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-rose-500 transition-colors"
					>
						<Search size={18} />
					</button>
				</form>
			</div>

			<!-- Right Icons -->
			<div class="flex items-center gap-1 sm:gap-2">
				<!-- Mobile Search Toggle -->
				<button
					onclick={() => (searchOpen = !searchOpen)}
					class="lg:hidden p-2 text-stone-700 hover:text-rose-600 transition-colors"
					aria-label="Search"
				>
					<Search size={22} />
				</button>

				<!-- Account -->
				<div class="relative">
					<a
						href={user ? "/account" : "/login"}
						class="p-2 text-stone-700 hover:text-rose-600 transition-colors inline-flex"
						aria-label={user ? "My Account" : "Login"}
					>
						<User size={22} />
					</a>
				</div>

				<!-- Wishlist (Desktop) -->
				<a
					href="/account/wishlist"
					class="hidden sm:inline-flex p-2 text-stone-700 hover:text-rose-600 transition-colors"
					aria-label="Wishlist"
				>
					<Heart size={22} />
				</a>

				<!-- Cart -->
				<button
					onclick={() => cartDrawerOpen.set(true)}
					class="p-2 text-stone-700 hover:text-rose-600 transition-colors relative"
					aria-label="Shopping cart"
				>
					<ShoppingBag size={22} />
					{#if $cartCount > 0}
						<span
							class="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
						>
							{$cartCount}
						</span>
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile Search Overlay -->
	{#if searchOpen}
		<div
			class="lg:hidden border-t border-stone-200 p-3 bg-white animate-fade-in"
		>
			<form action="/search" method="GET" class="relative">
				<input
					type="text"
					name="q"
					placeholder="Search products..."
					bind:value={searchQuery}
					class="w-full pl-4 pr-10 py-2.5 bg-stone-100 border border-stone-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
				/>
				<button
					type="submit"
					class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-rose-500"
				>
					<Search size={18} />
				</button>
			</form>
		</div>
	{/if}
</header>
