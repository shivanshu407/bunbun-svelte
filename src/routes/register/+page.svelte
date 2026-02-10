<script lang="ts">
    import { enhance } from "$app/forms";
    import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-svelte";

    let { form } = $props();

    let showPassword = $state(false);
    let loading = $state(false);
</script>

<svelte:head>
    <title>Create Account | BunBunClothing</title>
</svelte:head>

<div
    class="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-rose-50 via-white to-amber-50"
>
    <div class="w-full max-w-md">
        <div class="text-center mb-8">
            <a
                href="/"
                class="text-3xl font-bold font-[family-name:var(--font-heading)] text-stone-900"
            >
                Bun<span class="text-rose-500">Bun</span>
            </a>
            <h1
                class="mt-4 text-2xl font-semibold font-[family-name:var(--font-heading)] text-stone-900"
            >
                Create Your Account
            </h1>
            <p class="mt-2 text-sm text-stone-500">
                Join BunBunClothing for exclusive deals & easy checkout
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
                <!-- Name -->
                <div class="mb-4">
                    <label
                        for="name"
                        class="block text-sm font-medium text-stone-700 mb-1.5"
                        >Full Name</label
                    >
                    <div class="relative">
                        <User
                            size={18}
                            class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                        />
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            placeholder="Enter your full name"
                            value={form?.name ?? ""}
                            class="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

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
                            class="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                <!-- Phone -->
                <div class="mb-4">
                    <label
                        for="phone"
                        class="block text-sm font-medium text-stone-700 mb-1.5"
                        >Phone (optional)</label
                    >
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 1234567890"
                        value={form?.phone ?? ""}
                        class="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                    />
                </div>

                <!-- Password -->
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
                            minlength="6"
                            placeholder="Min 6 characters"
                            class="w-full pl-10 pr-12 py-3 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
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
                    class="w-full py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                    {#if loading}
                        <span
                            class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                        ></span>
                        Creating Account...
                    {:else}
                        Create Account <ArrowRight size={18} />
                    {/if}
                </button>
            </form>

            <div class="mt-6 text-center text-sm text-stone-500">
                Already have an account?
                <a
                    href="/login"
                    class="text-rose-600 hover:text-rose-700 font-medium"
                    >Login here</a
                >
            </div>
        </div>
    </div>
</div>
