<script lang="ts">
    import { Video } from 'lucide-svelte';

    interface Block {
        id: string;
        title: string | null;
        subtitle: string | null;
        imageUrl: string;
        linkUrl: string | null;
    }

    let { videos = [] }: { videos: Block[] } = $props();

    const placeholders = [
        { title: 'Video 1' },
        { title: 'Video 2' },
        { title: 'Video 3' },
        { title: 'Video 4' },
        { title: 'Video 5' },
    ];
</script>

<section class="py-8 md:py-12 bg-stone-50 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 md:px-6">
        {#if videos.length > 0}
            <div class="video-slider-track">
                {#each [0, 1] as _set}
                    <div class="video-slider-content">
                        {#each videos as video}
                            <a
                                href={video.linkUrl || '#'}
                                class="video-card flex-shrink-0 w-[140px] md:w-[200px] rounded-xl overflow-hidden relative bg-stone-200"
                            >
                                <div class="aspect-[2/3] relative">
                                    <video
                                        src={video.imageUrl}
                                        class="w-full h-full object-cover"
                                        autoplay
                                        muted
                                        loop
                                        playsinline
                                        preload="metadata"
                                    ></video>
                                    {#if video.title}
                                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                                            <div>
                                                <p class="text-white text-xs font-bold leading-tight drop-shadow-lg">{video.title}</p>
                                                {#if video.subtitle}
                                                    <p class="text-white/80 text-[10px] mt-0.5 drop-shadow">{video.subtitle}</p>
                                                {/if}
                                            </div>
                                        </div>
                                    {/if}
                                </div>
                            </a>
                        {/each}
                    </div>
                {/each}
            </div>
        {:else}
            <!-- Placeholder: show empty video slots -->
            <div class="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {#each placeholders as ph}
                    <div class="flex-shrink-0 w-[140px] md:w-[200px] rounded-xl overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200 flex flex-col items-center justify-center gap-2 aspect-[2/3]">
                        <Video size={28} class="text-stone-300" />
                        <span class="text-xs font-semibold text-stone-400">{ph.title}</span>
                        <span class="text-[10px] text-stone-300 text-center px-2">Upload from Admin → Homepage</span>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</section>

<style>
    .video-slider-track {
        display: flex;
        width: max-content;
        animation: video-scroll 30s linear infinite;
    }
    .video-slider-content {
        display: flex;
        gap: 12px;
        flex-shrink: 0;
        padding-right: 12px;
    }
    @keyframes video-scroll {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
    }
    .video-slider-track:hover {
        animation-play-state: paused;
    }
</style>

