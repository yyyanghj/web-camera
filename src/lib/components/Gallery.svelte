<script lang="ts">
    import { gallery, activePhoto } from '$lib/stores/gallery';
    import { fade } from 'svelte/transition';
    import { X } from 'lucide-svelte';

    function formatTime(timestamp: number) {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
</script>

<div class="w-full h-full bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex flex-col">
    <div class="p-2 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
        <span class="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Gallery ({$gallery.length})</span>
    </div>

    <div class="flex-1 overflow-x-auto overflow-y-hidden flex items-center p-2 space-x-2 min-h-0">
        {#if $gallery.length === 0}
            <div class="w-full text-center text-zinc-400 dark:text-zinc-600 font-mono text-xs">
                No photos yet
            </div>
        {:else}
            {#each $gallery as photo (photo.id)}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                    class="relative group flex-shrink-0 h-full aspect-[4/3] cursor-pointer ring-2 ring-transparent hover:ring-zinc-500 transition-all"
                    class:ring-white={$activePhoto?.id === photo.id}
                    transition:fade={{ duration: 200 }}
                    on:click={() => $activePhoto = photo}
                >
                    <div class="w-full h-full bg-black border border-zinc-200 dark:border-zinc-800 overflow-hidden relative">
                        <img src={photo.url} alt="Captured" class="w-full h-full object-cover" />

                        <div class="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-1 text-[9px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            ISO{photo.settings.iso} f/{photo.settings.aperture}
                        </div>
                    </div>

                    <button
                        class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                        on:click={() => gallery.removePhoto(photo.id)}
                    >
                        <X size={12} />
                    </button>
                </div>
            {/each}
        {/if}
    </div>
</div>
