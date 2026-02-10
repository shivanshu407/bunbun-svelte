<script lang="ts">
    import { enhance } from "$app/forms";
    import {
        Eye,
        EyeOff,
        Mail,
        Lock,
        ShieldCheck,
        ArrowRight,
    } from "lucide-svelte";

    let { form } = $props();

    let showPassword = $state(false);
    let loading = $state(false);
</script>

<svelte:head>
    <title>Admin Login | BunBunClothing</title>
</svelte:head>

<div
    class="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-stone-100 via-stone-50 to-stone-100"
>
    <div class="w-full max-w-md">
        <div class="text-center mb-8">
            <div
                class="inline-flex items-center justify-center w-16 h-16 bg-stone-900 rounded-2xl mb-4"
            >
                <ShieldCheck size={32} class="text-rose-400" />
            </div>
            <h1
                class="text-2xl font-semibold font-[family-name:var(--font-heading)] text-stone-900"
            >
                Admin Panel
            </h1>
            <p class="mt-2 text-sm text-stone-500">
                BunBunClothing Dashboard Access
            </p>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-8 border border-stone-200">
            {#if form?.error}
                <div
                    class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
                >
                    {form.error}
                </div>
            {/if}

            <form
                method="POST"
                use:enhance={() => {
                    loading = true;
                    return async ({ update }) => {
                        loading = false;
                        await update();
                    };
                }}
            >
                <div class="mb-4">
                    <label
                        for="email"
                        class="block text-sm font-medium text-stone-700 mb-1.5"
                        >Admin Email</label
                    >
                    <div class="relative">
                        <Mail
                            size={18}
                            class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                        />
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="admin@bunbunclothing.com"
                            value={form?.email ?? ""}
                            class="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                <div class="mb-6">
                    <label
                        for="password"
                        class="block text-sm font-medium text-stone-700 mb-1.5"
                        >Password</label
                    >
                    <div class="relative">
                        <Lock
                            size={18}
                            class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                        />
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Enter admin password"
                            class="w-full pl-10 pr-12 py-3 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all"
                        />
                        <button
                            type="button"
                            onclick={() => (showPassword = !showPassword)}
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                        >
                            {#if showPassword}<EyeOff size={18} />{:else}<Eye
                                    size={18}
                                />{/if}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    class="w-full py-3 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                    {#if loading}
                        <span
                            class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                        ></span>
                        Verifying...
                    {:else}
                        Access Dashboard <ArrowRight size={18} />
                    {/if}
                </button>
            </form>
        </div>
    </div>
</div>
