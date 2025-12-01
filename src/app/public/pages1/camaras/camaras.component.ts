import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardIconComponent } from '@shared/components/icon/icon.component';
import {
  Camera,
  CameraImage,
  NewCamera,
  UpdateCamera,
  NewCameraImage,
  UpdateCameraImage
} from '../models/camera.model';
import { CameraService } from '../services/camera.service';
import { ZoneService } from '../services/zone.service';
import { Zone } from '../models/zone.model';
import { ImageService } from '../services/image.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-camaras',
  standalone: true,
  imports: [CommonModule, FormsModule, ZardButtonComponent, ZardIconComponent],
  templateUrl: './camaras.component.html',
  styleUrl: './camaras.component.css'
})
export class CamarasComponent implements OnInit {
  cameras = signal<Camera[]>([]);
  zones = signal<Zone[]>([]);
  cameraImages = signal<CameraImage[]>([]);
  allImages = signal<CameraImage[]>([]);
  selectedCamera = signal<Camera | null>(null);
  editingCamera = signal<Camera | null>(null);
  editingImage = signal<CameraImage | null>(null);
  isLoadingImages = signal(false);
  isLoadingImageCatalog = signal(false);
  imagesLimit = 10;
  imageFilterCameraId = signal(0);
  filteredImages = computed(() => {
    const filter = this.imageFilterCameraId();
    const list = this.allImages();
    if (!filter) {
      return list;
    }
    return list.filter(image => image.camera_id === filter);
  });
  activeCameraCount = computed(() => this.cameras().filter((camera) => camera.is_active).length);
  inactiveCameraCount = computed(() => this.cameras().filter((camera) => !camera.is_active).length);
  imageCatalogCount = computed(() => this.allImages().length);

  newCamera: NewCamera = this.buildEmptyCamera();
  newImage: NewCameraImage = this.buildEmptyImage();

  constructor(
    private readonly cameraService: CameraService,
    private readonly zoneService: ZoneService,
    private readonly imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.loadCameras();
    this.loadZones();
    this.loadAllImages();
  }

  private buildEmptyCamera(): NewCamera {
    return {
      name: '',
      camera_type: '',
      model: '',
      is_active: true,
      location_description: '',
      zone_id: this.zones().length ? this.zones()[0].id : 0
    };
  }

  private buildEmptyImage(cameraId = this.getDefaultCameraId()): NewCameraImage {
    return {
      file_path: '',
      image_type: '',
      metadata: '',
      analysis_result: '',
      camera_id: cameraId,
      captured_at: new Date().toISOString()
    };
  }

  private getDefaultCameraId(): number {
    return this.cameras().length ? this.cameras()[0].id : 0;
  }

  private resetNewCameraForm(): void {
    this.newCamera = this.buildEmptyCamera();
    if (this.zones().length && !this.newCamera.zone_id) {
      this.newCamera.zone_id = this.zones()[0].id;
    }
  }

  private resetNewImageForm(cameraId?: number): void {
    const desiredCameraId = typeof cameraId === 'number'
      ? cameraId
      : (this.newImage.camera_id || this.getDefaultCameraId());
    this.newImage = this.buildEmptyImage(desiredCameraId);
  }

  loadCameras(): void {
    this.cameraService.getCameras().subscribe({
      next: (data) => {
        this.cameras.set(data);
        toast.success('Camaras cargadas correctamente');
        if (data.length && !this.newImage.camera_id) {
          this.resetNewImageForm(data[0].id);
        }
      },
      error: (err) => {
        console.error('Error al cargar camaras', err);
        toast.error('No se pudieron cargar las camaras');
      }
    });
  }

  loadZones(): void {
    this.zoneService.getAllZones().subscribe({
      next: (data) => {
        this.zones.set(data);
        if (data.length && !this.newCamera.zone_id) {
          this.newCamera.zone_id = data[0].id;
        }
      },
      error: (err) => {
        console.error('Error al cargar zonas', err);
        toast.error('No se pudieron cargar las zonas disponibles');
      }
    });
  }

  loadAllImages(): void {
    this.isLoadingImageCatalog.set(true);
    this.imageService.getImages().subscribe({
      next: (data) => {
        this.allImages.set(data);
        toast.success('Imagenes cargadas correctamente');
      },
      error: (err) => {
        console.error('Error al cargar imagenes', err);
        toast.error('No se pudieron cargar las imagenes');
      },
      complete: () => this.isLoadingImageCatalog.set(false)
    });
  }

  selectCamera(camera: Camera): void {
    this.selectedCamera.set(camera);
    this.editingCamera.set(null);
    this.cameraImages.set([]);
    this.loadImages(camera.id);
  }

  clearSelection(): void {
    this.selectedCamera.set(null);
    this.cameraImages.set([]);
  }

  createCamera(): void {
    if (this.zones().length === 0) {
      toast.error('Debe existir al menos una zona para crear camaras');
      return;
    }

    this.cameraService.createCamera(this.newCamera).subscribe({
      next: (camera) => {
        this.cameras.update(list => [...list, camera]);
        toast.success('Camara creada correctamente');
        this.resetNewCameraForm();
      },
      error: (err) => {
        console.error('Error al crear camara', err);
        toast.error('No se pudo crear la camara');
      }
    });
  }

  startEdit(camera: Camera): void {
    this.editingCamera.set({ ...camera });
    this.selectedCamera.set(null);
  }

  cancelEdit(): void {
    this.editingCamera.set(null);
  }

  saveEdit(): void {
    const editing = this.editingCamera();
    if (!editing) {
      return;
    }

    const payload: UpdateCamera = {
      name: editing.name,
      camera_type: editing.camera_type,
      model: editing.model,
      is_active: editing.is_active,
      location_description: editing.location_description,
      zone_id: editing.zone_id
    };

    this.cameraService.updateCamera(editing.id, payload).subscribe({
      next: (updated) => {
        this.cameras.update(list => list.map(cam => cam.id === updated.id ? updated : cam));
        this.editingCamera.set(null);
        if (this.selectedCamera()?.id === updated.id) {
          this.selectedCamera.set(updated);
        }
        toast.success('Camara actualizada correctamente');
      },
      error: (err) => {
        console.error('Error al actualizar camara', err);
        toast.error('No se pudo actualizar la camara');
      }
    });
  }

  deleteCamera(id: number): void {
    if (!confirm('Estas seguro de que deseas eliminar esta camara?')) {
      return;
    }

    this.cameraService.deleteCamera(id).subscribe({
      next: () => {
        this.cameras.update(list => list.filter(cam => cam.id !== id));
        if (this.selectedCamera()?.id === id) {
          this.clearSelection();
        }
        if (this.editingCamera()?.id === id) {
          this.editingCamera.set(null);
        }
        toast.success('Camara eliminada correctamente');
      },
      error: (err) => {
        console.error('Error al eliminar camara', err);
        toast.error('No se pudo eliminar la camara');
      }
    });
  }

  loadImages(cameraId: number): void {
    this.isLoadingImages.set(true);
    this.cameraService.getImages(cameraId, this.imagesLimit).subscribe({
      next: (images) => {
        this.cameraImages.set(images);
      },
      error: (err) => {
        console.error('Error al cargar imagenes', err);
        toast.error('No se pudieron cargar las imagenes de la camara');
        this.isLoadingImages.set(false);
      },
      complete: () => this.isLoadingImages.set(false)
    });
  }

  refreshImages(): void {
    const selected = this.selectedCamera();
    if (selected) {
      this.loadImages(selected.id);
    }
  }

  updateImagesLimit(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    const limitValue = target?.value ?? `${this.imagesLimit}`;
    const parsed = Number(limitValue);
    this.imagesLimit = Number.isNaN(parsed) ? 10 : parsed;
    this.refreshImages();
  }

  getZoneName(zoneId: number): string {
    if (!zoneId) {
      return 'Sin zona asignada';
    }
    const zone = this.zones().find(z => z.id === zoneId);
    return zone ? zone.name : `Zona ${zoneId}`;
  }

  getCameraName(cameraId: number): string {
    if (!cameraId) {
      return 'Sin camara';
    }
    const camera = this.cameras().find(cam => cam.id === cameraId);
    return camera ? camera.name : `Camara ${cameraId}`;
  }

  setImageFilter(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    const filterValue = target?.value ?? '0';
    const parsed = Number(filterValue);
    this.imageFilterCameraId.set(Number.isNaN(parsed) ? 0 : parsed);
  }

  createImage(): void {
    if (!this.newImage.camera_id) {
      toast.error('Seleccione una camara para asociar la imagen');
      return;
    }

    const payload: NewCameraImage = {
      ...this.newImage,
      captured_at: this.normalizeDate(this.newImage.captured_at)
    };

    this.imageService.createImage(payload).subscribe({
      next: (image) => {
        this.allImages.update(list => [...list, image]);
        toast.success('Imagen registrada correctamente');
        this.resetNewImageForm(image.camera_id);
        if (this.selectedCamera()?.id === image.camera_id) {
          this.refreshImages();
        }
      },
      error: (err) => {
        console.error('Error al crear imagen', err);
        toast.error('No se pudo registrar la imagen');
      }
    });
  }

  startImageEdit(image: CameraImage): void {
    this.editingImage.set({ ...image });
  }

  cancelImageEdit(): void {
    this.editingImage.set(null);
  }

  saveImageEdit(): void {
    const editing = this.editingImage();
    if (!editing) {
      return;
    }

    const payload: UpdateCameraImage = {
      file_path: editing.file_path,
      image_type: editing.image_type,
      metadata: editing.metadata,
      analysis_result: editing.analysis_result,
      camera_id: editing.camera_id,
      captured_at: this.normalizeDate(editing.captured_at)
    };

    this.imageService.updateImage(editing.id, payload).subscribe({
      next: (updated) => {
        this.allImages.update(list => list.map(img => img.id === updated.id ? updated : img));
        this.editingImage.set(null);
        toast.success('Imagen actualizada correctamente');
        if (this.selectedCamera()?.id === updated.camera_id) {
          this.refreshImages();
        }
      },
      error: (err) => {
        console.error('Error al actualizar imagen', err);
        toast.error('No se pudo actualizar la imagen');
      }
    });
  }

  deleteImage(id: number): void {
    if (!confirm('Estas seguro de que deseas eliminar esta imagen?')) {
      return;
    }

    this.imageService.deleteImage(id).subscribe({
      next: () => {
        this.allImages.update(list => list.filter(img => img.id !== id));
        toast.success('Imagen eliminada correctamente');
        if (this.editingImage()?.id === id) {
          this.editingImage.set(null);
        }
        if (this.selectedCamera()) {
          this.refreshImages();
        }
      },
      error: (err) => {
        console.error('Error al eliminar imagen', err);
        toast.error('No se pudo eliminar la imagen');
      }
    });
  }

  private normalizeDate(value: string): string {
    if (!value) {
      return new Date().toISOString();
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
  }

  trackByCamera = (_: number, camera: Camera): number => camera.id;
}
