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

class GalleryStore {
    photos = $state<Photo[]>([]);
    activePhoto = $state<Photo | null>(null);

    addPhoto(photo: Photo) {
        this.photos = [photo, ...this.photos];
    }

    removePhoto(id: string) {
        this.photos = this.photos.filter(p => p.id !== id);
    }

    clear() {
        this.photos = [];
    }
}

export const gallery = new GalleryStore();
