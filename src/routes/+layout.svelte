<script lang="ts">
	import "../app.css";
	import { page } from "$app/stores";
	import Header from "$lib/components/layout/Header.svelte";
	import NavBar from "$lib/components/layout/NavBar.svelte";
	import MobileNav from "$lib/components/layout/MobileNav.svelte";
	import Footer from "$lib/components/layout/Footer.svelte";
	import AnnouncementBar from "$lib/components/layout/AnnouncementBar.svelte";
	import MobileBottomNav from "$lib/components/layout/MobileBottomNav.svelte";
	import CartDrawer from "$lib/components/cart/CartDrawer.svelte";
	import Toast from "$lib/components/ui/Toast.svelte";
	import { currentUser } from "$lib/stores/user";
	import { wishlistIds } from "$lib/stores/wishlist";

	let { data, children } = $props<{
		data: {
			user: any;
			wishlistProductIds?: string[];
			categories?: { id: string; name: string; slug: string; image: string | null }[];
		};
		children: any;
	}>();

	let mobileNavOpen = $state(false);
	let isAdmin = $derived($page.url.pathname.startsWith("/admin"));

	// Sync server user data and wishlist to client stores
	$effect(() => {
		currentUser.set(data.user);
		if (data.wishlistProductIds) {
			wishlistIds.init(data.wishlistProductIds);
		}
	});
</script>

{#if isAdmin}
	<Toast />
	{@render children()}
{:else}
	<div class="min-h-screen flex flex-col">
		<Toast />
		<AnnouncementBar />
		<Header
			user={data.user}
			onMenuToggle={() => (mobileNavOpen = !mobileNavOpen)}
		/>
		<NavBar categories={data.categories ?? []} />
		<MobileNav
			open={mobileNavOpen}
			user={data.user}
			categories={data.categories ?? []}
			onClose={() => (mobileNavOpen = false)}
		/>
		<CartDrawer />

		<main class="flex-1 pb-[72px] lg:pb-0">
			{@render children()}
		</main>

		<Footer />
		<MobileBottomNav onMenuToggle={() => (mobileNavOpen = !mobileNavOpen)} />
	</div>
{/if}

