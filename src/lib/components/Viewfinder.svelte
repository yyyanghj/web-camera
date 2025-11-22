<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { brightness, camera } from '$lib/stores/camera';
  import { gallery } from '$lib/stores/gallery';
  import { Camera, X } from 'lucide-svelte';

  let videoElement: HTMLVideoElement;
  let stream: MediaStream | null = null;
  let error: string | null = null;
  let isStarted = false;

  async function startCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      if (videoElement) {
        videoElement.srcObject = stream;
      }
      isStarted = true;
      error = null;
    } catch (e) {
      console.error('Error accessing camera:', e);
      error = 'Unable to access camera. Please ensure you have granted permissions.';
      isStarted = false;
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
    isStarted = false;
  }

  function capturePhoto() {
    if (!videoElement || !isStarted) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Apply filters (brightness) to the captured image
    // Note: CSS filters on video don't automatically apply to canvas drawImage.
    // We need to manually apply them or use a more complex approach.
    // For MVP, let's just apply the brightness using filter property of context if supported,
    // or simple overlay.

    // Simple brightness simulation on canvas
    ctx.filter = `brightness(${$brightness})`;
    ctx.drawImage(videoElement, 0, 0);

    const url = canvas.toDataURL('image/jpeg', 0.9);

    gallery.addPhoto({
        id: crypto.randomUUID(),
        url,
        timestamp: Date.now(),
        settings: {
            iso: $camera.iso,
            aperture: $camera.aperture,
            shutterSpeed: $camera.shutterSpeed
        }
    });
  }

  onDestroy(() => {
    stopCamera();
  });
</script>

<div class="relative w-full h-full bg-black overflow-hidden flex items-center justify-center group">
  {#if !isStarted}
    <div class="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/90 z-20">
        {#if error}
            <p class="text-red-500 mb-4 font-mono text-sm">{error}</p>
        {/if}

        <button
            class="flex flex-col items-center space-y-3 group/btn"
            on:click={startCamera}
        >
            <div class="w-16 h-16 flex items-center justify-center border border-zinc-700 bg-zinc-800 text-zinc-400 group-hover/btn:border-zinc-500 group-hover/btn:text-zinc-200 transition-all">
                <Camera size={32} strokeWidth={1.5} />
            </div>
            <span class="font-mono text-xs uppercase tracking-widest text-zinc-500 group-hover/btn:text-zinc-300 transition-colors">Start Camera</span>
        </button>
    </div>
  {/if}

  <!-- Video Element -->
  <!-- svelte-ignore a11y_media_has_caption -->
  <video
    bind:this={videoElement}
    autoplay
    playsinline
    muted
    class="absolute inset-0 w-full h-full object-cover transition-all duration-200 {isStarted ? 'opacity-100' : 'opacity-0'}"
    style="filter: brightness({$brightness})"
  ></video>

  <!-- Grid Overlay (Rule of Thirds) -->
  {#if isStarted}
    <div class="absolute inset-0 pointer-events-none opacity-30">
        <div class="absolute top-1/3 left-0 w-full h-px bg-white"></div>
        <div class="absolute top-2/3 left-0 w-full h-px bg-white"></div>
        <div class="absolute top-0 left-1/3 w-px h-full bg-white"></div>
        <div class="absolute top-0 left-2/3 w-px h-full bg-white"></div>
    </div>

    <!-- Stop Button (Top Left) -->
    <button
        class="absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900/50 border border-zinc-500 text-zinc-300 hover:bg-zinc-900 hover:text-red-500 hover:border-red-500 transition-all backdrop-blur-sm z-20"
        on:click={stopCamera}
        title="Stop Camera"
    >
        <X size={18} />
    </button>

    <!-- Camera Controls Overlay (Bottom Center) -->
    <div class="absolute bottom-8 left-0 right-0 flex items-center justify-center z-10">
        <!-- Shutter Button -->
        <button
            class="w-20 h-20 rounded-full border-4 border-white/80 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
            on:click={capturePhoto}
        >
            <div class="w-16 h-16 rounded-full bg-white"></div>
        </button>
    </div>
  {/if}
</div>
