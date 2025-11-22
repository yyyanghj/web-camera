import { writable, derived } from 'svelte/store';

export interface CameraState {
    iso: number;
    aperture: number;
    shutterSpeed: number; // Denominator (e.g., 100 for 1/100s)
    focalLength: number;
}

function createCameraStore() {
    const { subscribe, set, update } = writable<CameraState>({
        iso: 400,
        aperture: 2.8,
        shutterSpeed: 125, // 1/125s
        focalLength: 24
    });

    return {
        subscribe,
        setIso: (iso: number) => update(s => ({ ...s, iso })),
        setAperture: (aperture: number) => update(s => ({ ...s, aperture })),
        setShutterSpeed: (speed: number) => update(s => ({ ...s, shutterSpeed: speed })),
        setFocalLength: (length: number) => update(s => ({ ...s, focalLength: length })),
        reset: () => set({ iso: 400, aperture: 2.8, shutterSpeed: 125, focalLength: 24 })
    };
}

export const camera = createCameraStore();

// Derived stores for simulation
export const exposureValue = derived(camera, ($camera) => {
    // Simple EV calculation: EV = log2(N^2 / t) - log2(ISO / 100)
    // N = aperture, t = shutter time (1/shutterSpeed)
    const N = $camera.aperture;
    const t = 1 / $camera.shutterSpeed;
    const iso = $camera.iso;

    const ev100 = Math.log2((N * N) / t);
    const ev = ev100 - Math.log2(iso / 100);

    return parseFloat(ev.toFixed(2));
});

// Brightness factor for CSS filter (1 is normal, <1 darker, >1 brighter)
// We assume EV 13 (sunny day) is "normal" exposure for the camera feed
export const brightness = derived(camera, ($camera) => {
    // Baseline: ISO 400, f/2.8, 1/125s
    const baseIso = 400;
    const baseAperture = 2.8;
    const baseShutter = 125;

    const isoFactor = $camera.iso / baseIso;
    const apertureFactor = (baseAperture * baseAperture) / ($camera.aperture * $camera.aperture);
    const shutterFactor = baseShutter / $camera.shutterSpeed;

    return isoFactor * apertureFactor * shutterFactor;
});
