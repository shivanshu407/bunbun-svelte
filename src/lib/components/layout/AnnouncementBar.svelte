<script lang="ts">
	import { X } from 'lucide-svelte';

	let visible = $state(true);

	function dismiss() {
		visible = false;
		if (typeof window !== 'undefined') {
			localStorage.setItem('announcement-dismissed', 'true');
		}
	}

	$effect(() => {
		if (typeof window !== 'undefined') {
			const dismissed = localStorage.getItem('announcement-dismissed');
			if (dismissed === 'true') {
				visible = false;
			}
		}
	});
</script>

{#if visible}
	<div class="bg-rose-500 text-white relative">
		<div class="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium">
			<span>🎉 FLAT 50% OFF on All Sarees! Use code <span class="code font-bold">BUNBUN50</span></span>
			<a href="/collections/sarees" class="underline underline-offset-2 hover:text-rose-100 ml-1">
				Shop Now →
			</a>
			<button
				onclick={dismiss}
				class="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-rose-600 rounded-full transition-colors"
				aria-label="Close announcement"
			>
				<X size={16} />
			</button>
		</div>
	</div>
{/if}
