<script lang="ts">
    import { enhance } from "$app/forms";
    import { page } from "$app/stores";
    import { toast } from "$lib/stores/toast";
    import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-svelte";

    let { form } = $props<{ form: any }>();

    let showPassword = $state(false);
    let loading = $state(false);

    $effect(() => {
        if ($page.url.searchParams.get("wishlist")) {
            // Tiny delay to ensure toast component is ready
            setTimeout(() => {
                toast.add(
                    "Login to save your wishlist and never lose it",
                    "error",
                    5000,
                );
            }, 100);
            // Clean up URL
            const url = new URL(window.location.href);
            url.searchParams.delete("wishlist");
            window.history.replaceState({}, "", url);
        }
    });
</script>

<svelte:head>
    <title>Login | BunBunClothing</title>
</svelte:head>

<div
    class="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 via-white to-amber-50"
>
    <div class="w-full max-w-md">
        <div class="text-center mb-8">
            <a
                href="/"
                class="text-3xl font-bold font-[family-name:var(--font-heading)] text-stone-900"
            >
                Bun<span class="text-primary-500">Bun</span>
            </a>
            <h1
                class="mt-4 text-2xl font-semibold font-[family-name:var(--font-heading)] text-stone-900"
            >
                Welcome Back!
            </h1>
            <p class="mt-2 text-sm text-stone-500">
                Login to your BunBunClothing account
            </p>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-8 border border-stone-100">
            {#if form?.error}
                <div
                    class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
                >
                    {form.error}
                </div>
            {/if}

            {#if form?.success}
                <div
                    class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700"
                >
                    {form.success}
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
                <!-- Email -->
                <div class="mb-4">
                    <label
                        for="email"
                        class="block text-sm font-medium text-stone-700 mb-1.5"
                        >Email Address</label
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
                            placeholder="you@example.com"
                            value={form?.email ?? ""}
                            class="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                <!-- Password -->
                <div class="mb-6">
                    <div class="flex items-center justify-between mb-1.5">
                        <label
                            for="password"
                            class="text-sm font-medium text-stone-700"
                            >Password</label
                        >
                        <a
                            href="/forgot-password"
                            class="text-xs text-primary-600 hover:text-primary-700"
                            >Forgot password?</a
                        >
                    </div>
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
                            placeholder="Enter your password"
                            class="w-full pl-10 pr-12 py-3 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                        <button
                            type="button"
                            onclick={() => (showPassword = !showPassword)}
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                        >
                            {#if showPassword}
                                <EyeOff size={18} />
                            {:else}
                                <Eye size={18} />
                            {/if}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    class="w-full py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                    {#if loading}
                        <span
                            class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                        ></span>
                        Logging in...
                    {:else}
                        Login <ArrowRight size={18} />
                    {/if}
                </button>
            </form>

            <div class="mt-6 text-center text-sm text-stone-500">
                Don't have an account?
                <a
                    href="/register"
                    class="text-primary-600 hover:text-primary-700 font-medium"
                    >Create one</a
                >
            </div>
        </div>
    </div>
</div>
