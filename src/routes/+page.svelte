<script lang="ts">
  import Viewfinder from '$lib/components/Viewfinder.svelte';
  import Controls from '$lib/components/Controls.svelte';
  import Gallery from '$lib/components/Gallery.svelte';
  import PhotoViewer from '$lib/components/PhotoViewer.svelte';
  import PhotoEditor from '$lib/components/PhotoEditor.svelte';
  import { gallery } from '$lib/stores/gallery.svelte';
</script>

<div class="h-screen w-screen flex flex-col md:flex-row bg-bg-primary text-text-primary overflow-hidden">
  <!-- Viewfinder / Photo Viewer Area -->
  <div class="flex-1 relative border-b md:border-b-0 md:border-r border-border-primary bg-bg-secondary flex flex-col">
    <div class="flex-1 relative overflow-hidden">
        {#if gallery.activePhoto}
            <PhotoViewer />
        {:else}
            <Viewfinder />
        {/if}
    </div>

    <!-- Gallery Strip -->
    <div class="h-32 shrink-0">
        <Gallery />
    </div>
  </div>

  <!-- Controls / Editor Area -->
  <div class="h-1/3 md:h-full md:w-80 bg-bg-primary flex flex-col items-center justify-start overflow-y-auto">
    {#if gallery.activePhoto}
        <PhotoEditor />
    {:else}
        <Controls />
    {/if}
  </div>
</div>
