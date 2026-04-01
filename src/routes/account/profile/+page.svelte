<script lang="ts">
    import { enhance } from "$app/forms";
    import { User, Lock, Save } from "lucide-svelte";

    let { data, form } = $props();
</script>

<svelte:head><title>My Profile | BunBunClothing</title></svelte:head>

<div class="space-y-6">
    <!-- Update Profile -->
    <div class="bg-white rounded-xl border border-stone-200 p-6">
        <h2
            class="text-lg font-medium text-stone-800 mb-4 flex items-center gap-2"
        >
            <User size={18} class="text-primary-500" /> Personal Information
        </h2>

        {#if form?.success}
            <div
                class="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700"
            >
                {form.success}
            </div>
        {/if}

        <form
            method="POST"
            action="?/updateProfile"
            use:enhance
            class="space-y-4"
        >
            <div>
                <label
                    for="name"
                    class="block text-sm font-medium text-stone-700 mb-1"
                    >Full Name</label
                >
                <input
                    id="name"
                    name="name"
                    required
                    value={data.profile?.name ?? ""}
                    class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>
            <div>
                <label
                    for="email"
                    class="block text-sm font-medium text-stone-700 mb-1"
                    >Email</label
                >
                <input
                    id="email"
                    type="email"
                    value={data.profile?.email ?? ""}
                    disabled
                    class="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm bg-stone-50 text-stone-500 cursor-not-allowed"
                />
                <p class="text-xs text-stone-400 mt-1">
                    Email cannot be changed
                </p>
            </div>
            <div>
                <label
                    for="phone"
                    class="block text-sm font-medium text-stone-700 mb-1"
                    >Phone</label
                >
                <input
                    id="phone"
                    name="phone"
                    value={data.profile?.phone ?? ""}
                    class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>
            <button
                type="submit"
                class="flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
                <Save size={16} /> Update Profile
            </button>
        </form>
    </div>

    <!-- Change Password -->
    <div class="bg-white rounded-xl border border-stone-200 p-6">
        <h2
            class="text-lg font-medium text-stone-800 mb-4 flex items-center gap-2"
        >
            <Lock size={18} class="text-primary-500" /> Change Password
        </h2>

        {#if form?.passwordError}
            <div
                class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
            >
                {form.passwordError}
            </div>
        {/if}
        {#if form?.passwordSuccess}
            <div
                class="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700"
            >
                {form.passwordSuccess}
            </div>
        {/if}

        <form
            method="POST"
            action="?/changePassword"
            use:enhance
            class="space-y-4"
        >
            <div>
                <label
                    for="currentPassword"
                    class="block text-sm font-medium text-stone-700 mb-1"
                    >Current Password</label
                >
                <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    required
                    class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>
            <div>
                <label
                    for="newPassword"
                    class="block text-sm font-medium text-stone-700 mb-1"
                    >New Password</label
                >
                <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    minlength={6}
                    class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>
            <div>
                <label
                    for="confirmPassword"
                    class="block text-sm font-medium text-stone-700 mb-1"
                    >Confirm New Password</label
                >
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>
            <button
                type="submit"
                class="flex items-center gap-2 px-5 py-2.5 bg-stone-800 hover:bg-stone-900 text-white text-sm font-medium rounded-lg transition-colors"
            >
                <Lock size={16} /> Change Password
            </button>
        </form>
    </div>
</div>
