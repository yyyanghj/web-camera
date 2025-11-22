<script lang="ts">
    import Knob from './Knob.svelte';
    import { camera } from '$lib/stores/camera';

    const isoOptions = [100, 200, 400, 800, 1600, 3200, 6400];
    const apertureOptions = [1.4, 2.0, 2.8, 4.0, 5.6, 8.0, 11, 16];
    const shutterOptions = [8000, 4000, 2000, 1000, 500, 250, 125, 60, 30, 15, 8, 4, 2, 1];

    function formatShutter(v: number) {
        return v >= 1 ? `1/${v}` : `${1/v}"`;
    }
</script>

<div class="w-full max-w-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
    <div class="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2 class="text-xs font-mono uppercase tracking-widest text-zinc-900 dark:text-zinc-100">Exposure</h2>
    </div>

    <div class="p-4 space-y-6">
        <Knob
            label="ISO"
            value={$camera.iso}
            options={isoOptions}
            on:change={(e) => camera.setIso(e.detail)}
        />

        <Knob
            label="Aperture"
            value={$camera.aperture}
            options={apertureOptions}
            format={(v) => `f/${v}`}
            on:change={(e) => camera.setAperture(e.detail)}
        />

        <Knob
            label="Shutter"
            value={$camera.shutterSpeed}
            options={shutterOptions}
            format={formatShutter}
            on:change={(e) => camera.setShutterSpeed(e.detail)}
        />
    </div>
</div>
