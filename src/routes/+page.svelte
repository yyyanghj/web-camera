<script lang="ts">
  import Viewfinder from '$lib/components/Viewfinder.svelte';
  import Controls from '$lib/components/Controls.svelte';
  import Gallery from '$lib/components/Gallery.svelte';
</script>

<div class="h-screen w-screen flex flex-col md:flex-row bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-200 overflow-hidden">
  <!-- Viewfinder Area -->
  <div class="flex-1 relative border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 bg-black flex flex-col">
    <div class="flex-1 relative overflow-hidden">
        <Viewfinder />
    </div>

    <!-- Gallery Strip -->
    <div class="h-32 flex-shrink-0">
        <Gallery />
    </div>
  </div>

  <!-- Controls Area -->
  <div class="h-1/3 md:h-full md:w-80 bg-zinc-50 dark:bg-zinc-950 p-2 flex flex-col items-center justify-start overflow-y-auto">
    <Controls />
  </div>
</div>
