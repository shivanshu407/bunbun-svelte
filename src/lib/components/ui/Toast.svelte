<script lang="ts">
    import { toast } from "$lib/stores/toast";
    import { quintOut } from "svelte/easing";
    import { fly } from "svelte/transition";
    import { X, CheckCircle, AlertCircle, Info } from "lucide-svelte";

    let toasts = $state<any[]>([]);

    toast.subscribe((value) => {
        toasts = value;
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
                return "bg-rose-50 text-rose-800 border-rose-200";
            default:
                return "bg-blue-50 text-blue-800 border-blue-200";
        }
    }
</script>

<div
    class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
>
    {#each toasts as t (t.id)}
        {@const Icon = getIcon(t.type)}
        <div
            in:fly={{ y: 20, duration: 300, easing: quintOut }}
            out:fly={{ x: 100, duration: 300, opacity: 0 }}
            class="pointer-events-auto flex items-start gap-3 p-4 rounded-lg border shadow-lg {getColor(
                t.type,
            )}"
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
