<script lang="ts">
	import "../app.css";
	import { page } from "$app/stores";
	import Header from "$lib/components/layout/Header.svelte";
	import NavBar from "$lib/components/layout/NavBar.svelte";
	import MobileNav from "$lib/components/layout/MobileNav.svelte";
	import Footer from "$lib/components/layout/Footer.svelte";
	import AnnouncementBar from "$lib/components/layout/AnnouncementBar.svelte";
	import CartDrawer from "$lib/components/cart/CartDrawer.svelte";
	import { currentUser } from "$lib/stores/user";
	import { wishlistIds } from "$lib/stores/wishlist";

	let { data, children } = $props();

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
	{@render children()}
{:else}
	<div class="min-h-screen flex flex-col">
		<AnnouncementBar />
		<Header
			user={data.user}
			onMenuToggle={() => (mobileNavOpen = !mobileNavOpen)}
		/>
		<NavBar />
		<MobileNav
			open={mobileNavOpen}
			user={data.user}
			onClose={() => (mobileNavOpen = false)}
		/>
		<CartDrawer />

		<main class="flex-1">
			{@render children()}
		</main>

		<Footer />
	</div>
{/if}
