<script lang="ts">
    import { page } from "$app/stores";
    import { Home, RefreshCw } from "lucide-svelte";
</script>

<svelte:head><title>Something went wrong | BunBunClothing</title></svelte:head>

<div class="min-h-[60vh] flex items-center justify-center px-4">
    <div class="text-center max-w-md">
        <p class="text-6xl mb-4">😔</p>
        <h1 class="text-2xl font-semibold text-stone-900 mb-2">
            Something went wrong
        </h1>
        <p class="text-stone-500 mb-2">
            {$page.error?.message ??
                "An unexpected error occurred. Please try again."}
        </p>
        <p class="text-xs text-stone-400 mb-8">Error {$page.status}</p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button
                onclick={() => location.reload()}
                class="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-full transition-colors"
            >
                <RefreshCw size={16} /> Try Again
            </button>
            <a
                href="/"
                class="inline-flex items-center justify-center gap-2 px-6 py-2.5 border-2 border-stone-300 text-stone-700 text-sm font-medium rounded-full hover:border-stone-400 transition-colors"
            >
                <Home size={16} /> Go Home
            </a>
        </div>
    </div>
</div>
