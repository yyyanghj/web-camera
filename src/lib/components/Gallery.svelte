<script lang="ts">
    import { gallery } from '$lib/stores/gallery';
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

    <div class="flex-1 overflow-x-auto flex items-center p-4 space-x-4">
        {#if $gallery.length === 0}
            <div class="w-full text-center text-zinc-400 dark:text-zinc-600 font-mono text-xs">
                No photos yet
            </div>
        {:else}
            {#each $gallery as photo (photo.id)}
                <div class="relative group flex-shrink-0" transition:fade={{ duration: 200 }}>
                    <div class="w-32 h-24 bg-black border border-zinc-200 dark:border-zinc-800 overflow-hidden relative">
                        <img src={photo.url} alt="Captured" class="w-full h-full object-cover" />

                        <div class="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-1 text-[9px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            ISO{photo.settings.iso} f/{photo.settings.aperture}
                        </div>
                    </div>

                    <button
                        class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        on:click={() => gallery.removePhoto(photo.id)}
                    >
                        <X size={12} />
                    </button>
                </div>
            {/each}
        {/if}
    </div>
</div>
