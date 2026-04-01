<script lang="ts">
	import { ChevronDown } from 'lucide-svelte';
	import { page } from '$app/stores';

	const categories = [
		{ name: 'Sarees', href: '/collections/sarees', hasMega: true },
		{ name: 'Blouses', href: '/collections/blouses', hasMega: false },
		{ name: 'Shapewear', href: '/collections/shapewear', hasMega: false },
		{ name: 'Towels', href: '/collections/towels', hasMega: false },
		{ name: 'Essentials', href: '/collections/essentials', hasMega: false },
		{ name: 'Sale 🔥', href: '/collections/sale', hasMega: false }
	];

	const megaMenuItems = {
		'By Fabric': [
			{ name: 'Silk Sarees', href: '/collections/sarees?fabric=silk' },
			{ name: 'Cotton Sarees', href: '/collections/sarees?fabric=cotton' },
			{ name: 'Georgette', href: '/collections/sarees?fabric=georgette' },
			{ name: 'Chiffon', href: '/collections/sarees?fabric=chiffon' }
		],
		'By Occasion': [
			{ name: 'Wedding', href: '/collections/sarees?occasion=wedding' },
			{ name: 'Party Wear', href: '/collections/sarees?occasion=party' },
			{ name: 'Casual', href: '/collections/sarees?occasion=casual' },
			{ name: 'Festive', href: '/collections/sarees?occasion=festive' }
		],
		'By Style': [
			{ name: 'Designer Sarees', href: '/collections/sarees?style=designer' },
			{ name: 'Ready to Wear', href: '/collections/sarees?style=ready-to-wear' },
			{ name: 'Celebrity Collection', href: '/collections/sarees?style=celebrity' },
			{ name: 'New Arrivals', href: '/collections/sarees?tag=new' }
		]
	};

	let megaOpen = $state(false);
</script>

<nav class="hidden lg:block bg-stone-50 border-b border-stone-200">
	<div class="max-w-7xl mx-auto px-4">
		<ul class="flex items-center gap-0 h-12">
			{#each categories as cat}
				<li
					class="relative"
					onmouseenter={() => { if (cat.hasMega) megaOpen = true; }}
					onmouseleave={() => { if (cat.hasMega) megaOpen = false; }}
				>
					<a
						href={cat.href}
						class="flex items-center gap-1 px-4 py-3 text-sm font-medium transition-colors
							{$page.url.pathname.startsWith(cat.href) 
								? 'text-primary-600' 
								: cat.name.includes('Sale') 
									? 'text-secondary-600 hover:text-secondary-700' 
									: 'text-stone-700 hover:text-primary-600'}"
					>
						{cat.name}
						{#if cat.hasMega}
							<ChevronDown size={14} class="transition-transform {megaOpen ? 'rotate-180' : ''}" />
						{/if}
					</a>

					<!-- Mega Menu for Sarees -->
					{#if cat.hasMega && megaOpen}
						<div class="absolute left-0 top-full w-[600px] bg-white border border-stone-200 rounded-b-lg shadow-xl p-6 grid grid-cols-3 gap-6 animate-fade-in z-50">
							{#each Object.entries(megaMenuItems) as [section, items]}
								<div>
									<h4 class="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">{section}</h4>
									<ul class="space-y-2">
										{#each items as item}
											<li>
												<a
													href={item.href}
													class="text-sm text-stone-700 hover:text-primary-600 transition-colors"
												>
													{item.name}
												</a>
											</li>
										{/each}
									</ul>
								</div>
							{/each}
							<div class="col-span-3 border-t border-stone-100 pt-4 mt-2">
								<a
									href="/collections/sarees"
									class="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
								>
									Shop All Sarees →
								</a>
							</div>
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</nav>
