<script lang="ts">
    import { toast } from "$lib/stores/toast";
    import { quintOut } from "svelte/easing";
    import { fly } from "svelte/transition";
    import { X, CheckCircle, AlertCircle, Info } from "lucide-svelte";
    import { browser } from "$app/environment";

    let toasts = $state<any[]>([]);
    let isMobile = $state(false);

    toast.subscribe((value) => {
        toasts = value;
    });

    $effect(() => {
        if (browser) {
            const checkMobile = () => {
                isMobile = window.innerWidth < 768; // md breakpoint
            };
            checkMobile();
            window.addEventListener("resize", checkMobile);
            return () => window.removeEventListener("resize", checkMobile);
        }
    });

    function getIcon(type: string) {
        switch (type) {
            case "success":
                return CheckCircle;
            case "error":
                return AlertCircle;
            default:
                return Info;
        }
    }

    function getColor(type: string) {
        switch (type) {
            case "success":
                return "bg-emerald-50 text-emerald-800 border-emerald-200";
            case "error":
                return "bg-primary-50 text-primary-800 border-primary-200";
            default:
                return "bg-blue-50 text-blue-800 border-blue-200";
        }
    }
</script>

<div
    class="fixed top-4 left-4 right-4 md:top-auto md:bottom-4 md:right-4 md:left-auto md:w-full md:max-w-sm z-50 flex flex-col gap-2 pointer-events-none"
>
    {#each toasts as t (t.id)}
        {@const Icon = getIcon(t.type)}
        <div
            in:fly={{ y: isMobile ? -20 : 20, duration: 300, easing: quintOut }}
            out:fly={{ x: 100, duration: 300, opacity: 0 }}
            class="pointer-events-auto flex items-start gap-3 p-4 rounded-lg border shadow-lg {getColor(
                t.type,
            )} bg-white"
        >
            <div class="flex-shrink-0 mt-0.5">
                <Icon size={20} />
            </div>
            <p class="flex-1 text-sm font-medium">{t.message}</p>
            <button
                onclick={() => toast.remove(t.id)}
                class="flex-shrink-0 text-current hover:opacity-70 transition-opacity"
            >
                <X size={18} />
            </button>
        </div>
    {/each}
</div>
