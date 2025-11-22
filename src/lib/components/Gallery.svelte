<script lang="ts">
    import { gallery } from '$lib/stores/gallery.svelte';
    import { Trash2 } from 'lucide-svelte';
    import { fade } from 'svelte/transition';
</script>

<div class="h-full w-full bg-zinc-900 border-t border-zinc-800 overflow-x-auto overflow-y-hidden whitespace-nowrap p-2 flex items-center space-x-2">
    {#if gallery.photos.length === 0}
        <div class="w-full text-center text-zinc-600 font-mono text-xs">
            No photos yet
        </div>
    {:else}
        {#each gallery.photos as photo (photo.id)}
            <div class="relative inline-block h-full aspect-4/3 group">
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                    class="relative group flex-shrink-0 h-full aspect-4/3 cursor-pointer ring-2 ring-transparent hover:ring-zinc-500 transition-all"
                    class:ring-white={gallery.activePhoto?.id === photo.id}
                    transition:fade={{ duration: 200 }}
                    onclick={() => gallery.activePhoto = photo}
                >
                    <div class="w-full h-full bg-black border border-zinc-200 dark:border-zinc-800 overflow-hidden relative">
                        <img src={photo.url} alt="Captured" class="w-full h-full object-cover" />

                        <!-- Delete Button (Visible on Hover) -->
                        <button
                            class="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            onclick={(e) => {
                                e.stopPropagation();
                                gallery.removePhoto(photo.id);
                            }}
                            title="Delete"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                </div>
            </div>
        {/each}
    {/if}
</div>
