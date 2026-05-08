<script lang="ts">
    interface Block {
        id: string;
        imageUrl: string;
        title: string | null;
    }

    let { logos = [] }: { logos: Block[] } = $props();
</script>

<div class="bg-stone-50 rounded-xl mx-4 md:mx-auto md:max-w-3xl p-4 my-2">
    <p class="text-xs font-semibold text-stone-500 text-center mb-3 uppercase tracking-wider">Get Extra Discount on Prepaid Payments</p>
    <div class="flex items-center justify-center gap-3 flex-wrap">
        {#if logos.length > 0}
            {#each logos as logo}
                <div class="h-6 px-2">
                    <img src={logo.imageUrl} alt={logo.title || 'Payment'} class="h-full object-contain" />
                </div>
            {/each}
        {:else}
            <!-- Placeholder logos -->
            {#each ['UPI', 'GPay', 'Visa', 'RuPay', 'BHIM'] as name}
                <span class="text-[10px] font-bold text-stone-400 bg-white border border-stone-200 rounded px-2.5 py-1">{name}</span>
            {/each}
        {/if}
    </div>
</div>

