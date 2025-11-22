<script lang="ts">
    import { gallery } from '$lib/stores/gallery.svelte';
    import { ArrowLeft } from 'lucide-svelte';
    import { fade } from 'svelte/transition';

    function close() {
        gallery.activePhoto = null;
    }
</script>

<div class="relative w-full h-full bg-bg-secondary flex items-center justify-center overflow-hidden" transition:fade={{ duration: 200 }}>
    {#if gallery.activePhoto}
        <img
            src={gallery.activePhoto.url}
            alt="Review"
            class="max-w-full max-h-full object-contain"
        />

        <!-- Back Button (Top Left) -->
        <button
            class="absolute top-0 left-0 w-10 h-10 flex items-center justify-center rounded-none bg-bg-overlay border border-border-overlay/50 text-text-overlay hover:bg-black hover:text-text-overlay hover:border-border-overlay transition-all backdrop-blur-sm z-20"
            onclick={close}
            title="Back to Camera"
        >
            <ArrowLeft size={18} />
        </button>

        <!-- Info Overlay -->
        <div class="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
            <div class="bg-bg-overlay backdrop-blur-md border border-border-overlay/20 px-4 py-2 rounded-full flex items-center space-x-4 text-xs font-mono text-text-overlay">
                <span>ISO {gallery.activePhoto.settings.iso}</span>
                <span class="w-px h-3 bg-border-overlay/30"></span>
                <span>f/{gallery.activePhoto.settings.aperture}</span>
                <span class="w-px h-3 bg-border-overlay/30"></span>
                <span>1/{gallery.activePhoto.settings.shutterSpeed}</span>
            </div>
        </div>
    {/if}
</div>
