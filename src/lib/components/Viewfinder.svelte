<script lang="ts">
    import { onMount } from 'svelte';
    import { camera } from '$lib/stores/camera.svelte';
    import { gallery } from '$lib/stores/gallery.svelte';
    import { Camera, Grid3X3, X } from 'lucide-svelte';

    let videoElement: HTMLVideoElement;
    let canvasElement: HTMLCanvasElement;
    let stream: MediaStream | null = $state(null);
    let isStarted = $state(false);
    let error: string | null = $state(null);

    // Effect to apply filters when camera settings change
    $effect(() => {
        if (videoElement) {
            // Apply brightness filter based on simulation
            // brightness is 1.0 for normal.
            // CSS filter brightness(1) is normal.
            // We can map our brightness factor directly.
            videoElement.style.filter = `brightness(${camera.brightness})`;
        }
    });

    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    aspectRatio: { ideal: 4/3 } // Standard photo aspect ratio
                },
                audio: false
            });

            if (videoElement) {
                videoElement.srcObject = stream;
                isStarted = true;
                error = null;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            error = "Could not access camera. Please allow permissions.";
        }
    }

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
        if (videoElement) {
            videoElement.srcObject = null;
        }
        isStarted = false;
    }

    function capturePhoto() {
        if (!videoElement || !canvasElement || !isStarted) return;

        const width = videoElement.videoWidth;
        const height = videoElement.videoHeight;

        canvasElement.width = width;
        canvasElement.height = height;

        const ctx = canvasElement.getContext('2d');
        if (ctx) {
            // Draw the video frame
            // Apply the same brightness filter to the context
            ctx.filter = `brightness(${camera.brightness})`;
            ctx.drawImage(videoElement, 0, 0, width, height);

            // Reset filter
            ctx.filter = 'none';

            const url = canvasElement.toDataURL('image/jpeg', 0.9);

            gallery.addPhoto({
                id: crypto.randomUUID(),
                url,
                timestamp: Date.now(),
                settings: {
                    iso: camera.iso,
                    aperture: camera.aperture,
                    shutterSpeed: camera.shutterSpeed
                }
            });
        }
    }

    $effect(() => {
        return () => {
            stopCamera();
        };
    });
</script>

<div class="w-full h-full bg-black relative overflow-hidden flex items-center justify-center">
    <!-- Hidden Canvas for Capture -->
    <canvas bind:this={canvasElement} class="hidden"></canvas>

    {#if !isStarted}
        <div class="text-center space-y-4 z-10">
            <div class="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto border border-zinc-800 text-zinc-500">
                <Camera size={32} />
            </div>
            <h2 class="text-zinc-300 font-mono text-sm">Camera Stopped</h2>
            {#if error}
                <p class="text-red-500 text-xs font-mono max-w-xs mx-auto">{error}</p>
            {/if}
            <button
                class="px-6 py-2 bg-zinc-100 text-zinc-900 font-mono text-sm rounded-full hover:bg-white transition-colors"
                onclick={startCamera}
            >
                Start Camera
            </button>
        </div>
    {/if}

    <!-- Video Feed -->
    <!-- svelte-ignore a11y_media_has_caption -->
    <video
        bind:this={videoElement}
        autoplay
        playsinline
        class="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
        class:opacity-0={!isStarted}
        class:opacity-100={isStarted}
    ></video>

    <!-- Overlays (only visible when started) -->
    {#if isStarted}
        <!-- Grid Overlay -->
        <div class="absolute inset-0 pointer-events-none opacity-30">
            <div class="w-full h-full border-collapse flex flex-col">
                <div class="flex-1 flex border-b border-white/50">
                    <div class="flex-1 border-r border-white/50"></div>
                    <div class="flex-1 border-r border-white/50"></div>
                    <div class="flex-1"></div>
                </div>
                <div class="flex-1 flex border-b border-white/50">
                    <div class="flex-1 border-r border-white/50"></div>
                    <div class="flex-1 border-r border-white/50"></div>
                    <div class="flex-1"></div>
                </div>
                <div class="flex-1 flex">
                    <div class="flex-1 border-r border-white/50"></div>
                    <div class="flex-1 border-r border-white/50"></div>
                    <div class="flex-1"></div>
                </div>
            </div>
        </div>

        <!-- Stop Button (Top Left) -->
        <button
            class="absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900/50 border border-zinc-500 text-zinc-300 hover:bg-zinc-900 hover:text-red-500 hover:border-red-500 transition-all backdrop-blur-sm z-20"
            onclick={stopCamera}
            title="Stop Camera"
        >
            <X size={18} />
        </button>

        <!-- Shutter Button -->
        <div class="absolute bottom-8 left-0 right-0 flex justify-center z-20">
            <button
                class="w-16 h-16 rounded-full border-4 border-white bg-transparent hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center"
                onclick={capturePhoto}
                title="Capture Photo"
            >
                <div class="w-12 h-12 bg-white rounded-full"></div>
            </button>
        </div>
    {/if}
</div>
