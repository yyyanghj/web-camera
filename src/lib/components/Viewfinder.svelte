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

    const filters: Record<string, string> = {
        'Standard': 'none',
        'B&W': 'grayscale(100%) contrast(120%)',
        'Vintage': 'sepia(40%) contrast(110%) brightness(110%) saturate(80%)',
        'Cool': 'saturate(80%) contrast(110%) hue-rotate(180deg)',
        'Warm': 'sepia(30%) saturate(120%) contrast(110%)'
    };

    // Effect to apply filters and zoom when camera settings change
    $effect(() => {
        if (videoElement) {
            // Apply brightness filter based on simulation
            // Combine with selected film simulation filter
            const brightnessFilter = `brightness(${camera.brightness})`;
            const selectedFilter = filters[camera.filter];
            const filmFilter = selectedFilter && selectedFilter !== 'none' ? selectedFilter : '';

            // Combine filters: brightness first, then film simulation
            videoElement.style.filter = `${brightnessFilter} ${filmFilter}`.trim();

            // Apply zoom via scale transform
            videoElement.style.transform = `scale(${camera.zoom})`;
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
            videoElement.style.transform = 'none'; // Reset transform
        }
        isStarted = false;
    }

    function capturePhoto() {
        if (!videoElement || !canvasElement || !isStarted) return;

        const videoWidth = videoElement.videoWidth;
        const videoHeight = videoElement.videoHeight;

        // The canvas size should match the video resolution
        canvasElement.width = videoWidth;
        canvasElement.height = videoHeight;

        const ctx = canvasElement.getContext('2d');
        if (ctx) {
            // Calculate crop area for zoom
            // If zoom is 2x, we need to take the center 1/2 of the video
            const zoom = camera.zoom;
            const cropWidth = videoWidth / zoom;
            const cropHeight = videoHeight / zoom;
            const cropX = (videoWidth - cropWidth) / 2;
            const cropY = (videoHeight - cropHeight) / 2;

            // Apply filters
            const brightnessFilter = `brightness(${camera.brightness})`;
            const selectedFilter = filters[camera.filter];
            const filmFilter = selectedFilter && selectedFilter !== 'none' ? selectedFilter : '';
            ctx.filter = `${brightnessFilter} ${filmFilter}`.trim();

            // Draw the cropped (zoomed) area to fill the canvas
            ctx.drawImage(
                videoElement,
                cropX, cropY, cropWidth, cropHeight, // Source crop
                0, 0, videoWidth, videoHeight // Destination (full canvas)
            );

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

<div class="w-full h-full bg-bg-secondary relative overflow-hidden flex items-center justify-center">
    <!-- Hidden Canvas for Capture -->
    <canvas bind:this={canvasElement} class="hidden"></canvas>

    {#if !isStarted}
        <div class="text-center space-y-4 z-10">
            <div class="w-16 h-16 bg-bg-tertiary rounded-full flex items-center justify-center mx-auto border border-border-primary text-text-secondary">
                <Camera size={32} />
            </div>
            <h2 class="text-text-primary font-mono text-sm">Camera Stopped</h2>
            {#if error}
                <p class="text-danger text-xs font-mono max-w-xs mx-auto">{error}</p>
            {/if}
            <button
                class="px-6 py-2 bg-bg-inverse text-text-inverse font-mono text-sm rounded-full hover:opacity-90 transition-opacity"
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
            class="absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 border border-white/50 text-white hover:bg-black hover:text-danger hover:border-danger transition-all backdrop-blur-sm z-20"
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
