export interface CameraState {
    iso: number;
    aperture: number;
    shutterSpeed: number;
    focalLength: number;
}

class CameraStore {
    state = $state<CameraState>({
        iso: 400,
        aperture: 2.8,
        shutterSpeed: 125,
        focalLength: 24
    });

    setIso(iso: number) { this.state.iso = iso; }
    setAperture(aperture: number) { this.state.aperture = aperture; }
    setShutterSpeed(speed: number) { this.state.shutterSpeed = speed; }
    setFocalLength(length: number) { this.state.focalLength = length; }

    reset() {
        this.state.iso = 400;
        this.state.aperture = 2.8;
        this.state.shutterSpeed = 125;
        this.state.focalLength = 24;
    }

    get iso() { return this.state.iso; }
    set iso(v: number) { this.state.iso = v; }

    get aperture() { return this.state.aperture; }
    set aperture(v: number) { this.state.aperture = v; }

    get shutterSpeed() { return this.state.shutterSpeed; }
    set shutterSpeed(v: number) { this.state.shutterSpeed = v; }

    get focalLength() { return this.state.focalLength; }
    set focalLength(v: number) { this.state.focalLength = v; }

    get exposureValue() {
        const N = this.state.aperture;
        const t = 1 / this.state.shutterSpeed;
        const iso = this.state.iso;

        const ev100 = Math.log2((N * N) / t);
        const ev = ev100 - Math.log2(iso / 100);

        return parseFloat(ev.toFixed(2));
    }

    get brightness() {
        const baseIso = 400;
        const baseAperture = 2.8;
        const baseShutter = 125;

        const isoFactor = this.state.iso / baseIso;
        const apertureFactor = (baseAperture * baseAperture) / (this.state.aperture * this.state.aperture);
        const shutterFactor = baseShutter / this.state.shutterSpeed;

        return isoFactor * apertureFactor * shutterFactor;
    }
}

export const camera = new CameraStore();
