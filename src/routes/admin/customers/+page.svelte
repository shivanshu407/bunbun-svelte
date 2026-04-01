<script lang="ts">
    import { Users } from "lucide-svelte";

    let { data } = $props();
</script>

<svelte:head><title>Customers | Admin</title></svelte:head>

<div>
    <h1
        class="text-2xl font-bold font-[family-name:var(--font-heading)] text-stone-900 mb-6"
    >
        Customers
    </h1>

    <div class="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {#if data.customers.length === 0}
            <div class="py-16 text-center">
                <Users size={40} class="mx-auto text-stone-300 mb-3" />
                <p class="text-stone-500">No customers yet</p>
            </div>
        {:else}
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-stone-50">
                        <tr>
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Customer</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Email</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Phone</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Orders</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Reviews</th
                            >
                            <th
                                class="text-left text-xs font-semibold text-stone-500 uppercase px-6 py-3"
                                >Joined</th
                            >
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-stone-100">
                        {#each data.customers as customer}
                            <tr class="hover:bg-stone-50 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm"
                                        >
                                            {customer.name[0]}
                                        </div>
                                        <span
                                            class="text-sm font-medium text-stone-800"
                                            >{customer.name}</span
                                        >
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-sm text-stone-600"
                                    >{customer.email}</td
                                >
                                <td class="px-6 py-4 text-sm text-stone-600"
                                    >{customer.phone ?? "—"}</td
                                >
                                <td class="px-6 py-4 text-sm text-stone-600"
                                    >{customer._count.orders}</td
                                >
                                <td class="px-6 py-4 text-sm text-stone-600"
                                    >{customer._count.reviews}</td
                                >
                                <td class="px-6 py-4 text-sm text-stone-500">
                                    {new Date(
                                        customer.createdAt,
                                    ).toLocaleDateString("en-IN")}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    </div>
</div>
