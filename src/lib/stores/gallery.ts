import { writable } from 'svelte/store';

export interface Photo {
    id: string;
    url: string;
    timestamp: number;
    settings: {
        iso: number;
        aperture: number;
        shutterSpeed: number;
    };
}

function createGalleryStore() {
    const { subscribe, update } = writable<Photo[]>([]);

    return {
        subscribe,
        addPhoto: (photo: Photo) => update(photos => [photo, ...photos]),
        removePhoto: (id: string) => update(photos => photos.filter(p => p.id !== id)),
        clear: () => update(() => [])
    };
}

export const gallery = createGalleryStore();
export const activePhoto = writable<Photo | null>(null);
