<script lang="ts">
  import Knob from './Knob.svelte';
  import Section from './Section.svelte';
  import { camera } from '$lib/stores/camera.svelte';

  const isoOptions = [100, 200, 400, 800, 1600, 3200, 6400];
  const apertureOptions = [1.4, 2.0, 2.8, 4.0, 5.6, 8.0, 11, 16];
  const shutterOptions = [8000, 4000, 2000, 1000, 500, 250, 125, 60, 30, 15, 8, 4, 2, 1, 0.5, 0.25, 0.125];

  function formatAperture(v: number) {
      return `f/${v}`;
  }

  function formatShutter(v: number) {
      return v >= 1 ? `1/${v}` : `${1/v}"`;
  }

  function formatMeterReading(v: number) {
      if (v === 0) return "0.0";

      const absValue = Math.abs(v);
      const sign = v > 0 ? "+" : "-";

      // Check if it's close to 1/3
      if (Math.abs(absValue - 1/3) < 0.01) return `${sign}1/3`;
      // Check if it's close to 2/3
      if (Math.abs(absValue - 2/3) < 0.01) return `${sign}2/3`;
      // Otherwise show as decimal
      return `${sign}${absValue.toFixed(1)}`;
  }
</script>

<div class="w-full flex flex-col">
  <Section title="Exposure">
      <div class="flex flex-col space-y-6">
          <Knob
              label="ISO"
              value={camera.iso}
              options={isoOptions}
              onChange={(v) => camera.iso = v}
              tooltip="Sensitivity to light. Higher values (e.g., 6400) are brighter but add grain/noise."
          />

          <Knob
              label="Aperture"
              value={camera.aperture}
              options={apertureOptions}
              format={formatAperture}
              onChange={(v) => camera.aperture = v}
              tooltip="Lens opening size. Lower f-numbers (e.g., f/1.4) let in more light and blur the background."
          />

          <Knob
              label="Shutter"
              value={camera.shutterSpeed}
              options={shutterOptions}
              format={formatShutter}
              onChange={(v) => camera.shutterSpeed = v}
              tooltip="Exposure time. Faster speeds (e.g., 1/1000) freeze motion; slower speeds (e.g., 1/30) blur motion."
          />
      </div>
  </Section>

  <Section title="Lens">
      <div class="flex flex-col space-y-6">
          <Knob
              label="Focal Length"
              value={camera.focalLength}
              options={[24, 35, 50, 85, 105, 200]}
              format={(v) => `${v}mm`}
              onChange={(v) => camera.focalLength = v}
              tooltip="Zoom level. Higher values (telephoto) zoom in; lower values (wide) show more of the scene."
          />
      </div>
  </Section>

  <Section title="Film Simulation">
      <div class="flex flex-col space-y-6">
          <Knob
              label="Profile"
              value={camera.filter}
              options={['Standard', 'B&W', 'Vintage', 'Cool', 'Warm']}
              onChange={(v) => camera.filter = v}
          />
      </div>
  </Section>

  <Section title="Meter">
      <div class="grid grid-cols-2 gap-4">
          <div class="p-3 bg-bg-secondary border border-border-primary">
              <div class="text-[10px] text-text-secondary mb-1 font-mono">M.M.</div>
              <div class="text-lg font-mono text-text-primary">
                {formatMeterReading(camera.meterReading)} EV
              </div>
          </div>
          <div class="p-3 bg-bg-secondary border border-border-primary">
              <div class="text-[10px] text-text-secondary mb-1 font-mono">BRIGHTNESS</div>
              <div class="text-lg font-mono">{Math.round(camera.brightness * 100)}%</div>
          </div>
      </div>
  </Section>
</div>
