<script lang="ts">
  import Knob from './Knob.svelte';
  import Section from './Section.svelte';
  import { camera } from '$lib/stores/camera.svelte';
  import { Sun, Aperture, Timer } from 'lucide-svelte';

  const isoOptions = [100, 200, 400, 800, 1600, 3200, 6400];
  const apertureOptions = [1.4, 2.0, 2.8, 4.0, 5.6, 8.0, 11, 16];
  const shutterOptions = [8000, 4000, 2000, 1000, 500, 250, 125, 60, 30, 15, 8, 4, 2, 1];

  function formatAperture(v: number) {
      return `f/${v}`;
  }

  function formatShutter(v: number) {
      return v >= 1 ? `1/${v}` : `${1/v}"`;
  }
</script>

<div class="w-full flex flex-col">
  <Section title="Exposure">
      <div class="space-y-6">
          <Knob
              value={camera.iso}
              options={isoOptions}
              label="ISO"
              onChange={(v) => camera.iso = v}
          />

          <Knob
              value={camera.aperture}
              options={apertureOptions}
              label="Aperture"
              format={formatAperture}
              onChange={(v) => camera.aperture = v}
          />

          <Knob
              value={camera.shutterSpeed}
              options={shutterOptions}
              label="Shutter"
              format={formatShutter}
              onChange={(v) => camera.shutterSpeed = v}
          />
      </div>
  </Section>

  <Section title="Meter">
      <div class="grid grid-cols-2 gap-4">
          <div class="p-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div class="text-[10px] text-zinc-500 mb-1 font-mono">EV</div>
              <div class="text-lg font-mono">{camera.exposureValue}</div>
          </div>
          <div class="p-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div class="text-[10px] text-zinc-500 mb-1 font-mono">BRIGHTNESS</div>
              <div class="text-lg font-mono">{Math.round(camera.brightness * 100)}%</div>
          </div>
      </div>
  </Section>
</div>
