<script lang="ts">
    import { ImageOff } from "lucide-svelte";

    interface Props {
        size?: "sm" | "md" | "lg" | "xl";
    }

    let { size = "md" }: Props = $props();

    const sizeMap = {
        sm: { icon: 16, text: "text-[10px]" },
        md: { icon: 24, text: "text-xs" },
        lg: { icon: 32, text: "text-xs" },
        xl: { icon: 48, text: "text-sm" },
    };

    const s = $derived(sizeMap[size]);
</script>

<div
    class="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-stone-50"
>
    <ImageOff size={s.icon} class="text-stone-300" strokeWidth={1.5} />
    <span class="{s.text} text-stone-400 font-medium tracking-wide"
        >No Image</span
    >
</div>
