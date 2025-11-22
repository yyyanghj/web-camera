function createCameraStore() {
    // State
    let iso = $state(400);
    let aperture = $state(2.8);
    let shutterSpeed = $state(500);
    let focalLength = $state(24); // Default 24mm (1x)
    let filter = $state('Standard'); // Default filter

    const baseFocalLength = 24;

    // Derived values
    // shutterSpeed is stored as reciprocal (e.g., 125 for 1/125s, 0.5 for 2s)
    // Formula: EV = log2(N^2 * S * 100/ISO)
    let exposureValue = $derived(Math.log2((aperture ** 2) * shutterSpeed * (100 / iso)));

    // Target EV for "correct" exposure (e.g., sunny day ~15, indoor ~7)
    // Let's assume a target EV of around 10 for this simulation
    const targetEV = 10;

    // Meter Reading (Scene EV - Settings EV)
    // If Scene is 10, Settings is 10 -> 0 (Correct)
    // If Scene is 10, Settings is 11 (Darker settings) -> -1 (Underexposed)
    // If Scene is 10, Settings is 9 (Brighter settings) -> +1 (Overexposed)
    let meterReading = $derived(targetEV - exposureValue);

    // Brightness simulation
    let brightness = $derived(Math.pow(2, meterReading));

    // Zoom factor
    let zoom = $derived(focalLength / baseFocalLength);

    return {
        get iso() { return iso; },
        set iso(v) { iso = v; },

        get aperture() { return aperture; },
        set aperture(v) { aperture = v; },

        get shutterSpeed() { return shutterSpeed; },
        set shutterSpeed(v) { shutterSpeed = v; },

        get focalLength() { return focalLength; },
        set focalLength(v) { focalLength = v; },

        get filter() { return filter; },
        set filter(v) { filter = v; },

        get exposureValue() { return parseFloat(exposureValue.toFixed(2)); },
        get meterReading() {
            // Snap to nearest 1/3 EV
            // 0, 1/3, 2/3, 1, 4/3, etc.
            const raw = meterReading;
            const stepped = Math.round(raw * 3) / 3;
            return parseFloat(stepped.toFixed(2));
        },
        get brightness() { return brightness; },
        get zoom() { return zoom; }
    };
}

export const camera = createCameraStore();
