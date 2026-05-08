<script lang="ts">
	import { page } from '$app/stores';

	interface Category {
		id: string;
		name: string;
		slug: string;
		image: string | null;
	}

	let { categories = [] }: { categories: Category[] } = $props();
</script>

<nav class="hidden lg:block bg-stone-50 border-b border-stone-200">
	<div class="max-w-7xl mx-auto px-4">
		<ul class="flex items-center gap-0 h-12">
			{#each categories as cat}
				<li class="relative">
					<a
						href="/collections/{cat.slug}"
						class="flex items-center gap-1 px-4 py-3 text-sm font-medium transition-colors
							{$page.url.pathname.startsWith(`/collections/${cat.slug}`)
								? 'text-primary-600'
								: 'text-stone-700 hover:text-primary-600'}"
					>
						{cat.name}
					</a>
				</li>
			{/each}
			<li class="relative">
				<a
					href="/collections"
					class="flex items-center gap-1 px-4 py-3 text-sm font-medium transition-colors text-secondary-600 hover:text-secondary-700"
				>
					All Collections
				</a>
			</li>
		</ul>
	</div>
</nav>

