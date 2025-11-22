<script lang="ts">
    import { gallery } from '$lib/stores/gallery.svelte';
    import { ArrowLeft } from 'lucide-svelte';
    import { fade } from 'svelte/transition';

    function close() {
        gallery.activePhoto = null;
    }
</script>

<div class="relative w-full h-full bg-black flex items-center justify-center overflow-hidden" transition:fade={{ duration: 200 }}>
    {#if gallery.activePhoto}
        <img
            src={gallery.activePhoto.url}
            alt="Review"
            class="max-w-full max-h-full object-contain"
        />

        <!-- Back Button (Top Left) -->
        <button
            class="absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900/50 border border-zinc-500 text-zinc-300 hover:bg-zinc-900 hover:text-white hover:border-white transition-all backdrop-blur-sm z-20"
            onclick={close}
            title="Back to Camera"
        >
            <ArrowLeft size={18} />
        </button>

        <!-- Info Overlay -->
        <div class="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
            <div class="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 px-4 py-2 rounded-full flex items-center space-x-4 text-xs font-mono text-zinc-300">
                <span>ISO {gallery.activePhoto.settings.iso}</span>
                <span class="w-px h-3 bg-zinc-700"></span>
                <span>f/{gallery.activePhoto.settings.aperture}</span>
                <span class="w-px h-3 bg-zinc-700"></span>
                <span>1/{gallery.activePhoto.settings.shutterSpeed}</span>
            </div>
        </div>
    {/if}
</div>
