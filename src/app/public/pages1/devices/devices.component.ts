 import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeviceService } from '../services/device.service';
import { ZoneService } from '../services/zone.service';
import { FarmService } from '../services/farm.service';
import { ParcelService } from '../services/parcel.service';
import { Device, NewDevice, UpdateDevice } from '../models/device.model';
import { Zone, NewZone } from '../models/zone.model';
import { Farm, NewFarm } from '../models/farm.model';
import { Parcel, NewParcel } from '../models/parcel.model';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [CommonModule, FormsModule, ZardButtonComponent],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.css'
})
export class DevicesComponent implements OnInit {
  devices = signal<Device[]>([]);
  zones = signal<Zone[]>([]);
  farms = signal<Farm[]>([]);
  parcels = signal<Parcel[]>([]);
  selectedDevice = signal<Device | null>(null);
  editingDevice = signal<Device | null>(null);
  showZoneCreation = false;
  showFarmCreation = false;
  showParcelCreation = false;

  newDevice: NewDevice = {
    name: '',
    device_type: '',
    serial_number: '',
    firmware_version: '',
    is_online: false,
    zone_id: 0
  };

  newZone: NewZone = {
    name: '',
    crop_type: '',
    description: '',
    area_m2: 0,
    parcel_id: 0
  };

  newFarm: NewFarm = {
    name: '',
    location: '',
    description: ''
  };

  newParcel: NewParcel = {
    name: '',
    description: '',
    area_hectares: 0,
    farm_id: 0
  };

  constructor(
    private deviceService: DeviceService,
    private zoneService: ZoneService,
    private farmService: FarmService,
    private parcelService: ParcelService
  ) { }

  ngOnInit(): void {
    this.loadDevices();
    this.loadZones();
    this.loadFarms();
    this.loadParcels();
    this.resetNewDeviceForm();
    this.resetNewZoneForm();
    this.resetNewFarmForm();
    this.resetNewParcelForm();
  }

  loadFarms(): void {
    this.farmService.getAllFarms().subscribe({
      next: (data) => {
        this.farms.set(data);
        if (data.length > 0) {
          this.newParcel.farm_id = data[0].id; // Set default to the first farm
        }
        toast.success('Granjas cargadas correctamente');
      },
      error: (err) => {
        console.error('Error al cargar granjas', err);
        toast.error('Error al cargar granjas');
      }
    });
  }

  loadParcels(): void {
    this.parcelService.getAllParcels().subscribe({
      next: (data) => {
        this.parcels.set(data);
        if (data.length > 0) {
          this.newZone.parcel_id = data[0].id; // Set default to the first parcel
        }
        toast.success('Parcelas cargadas correctamente');
      },
      error: (err) => {
        console.error('Error al cargar parcelas', err);
        toast.error('Error al cargar parcelas');
      }
    });
  }

  loadDevices(): void {
    this.deviceService.getAllDevices().subscribe({
      next: (data) => {
        this.devices.set(data);
        toast.success('Dispositivos cargados correctamente');
      },
      error: (err) => {
        console.error('Error al cargar dispositivos', err);
        toast.error('Error al cargar dispositivos');
      }
    });
  }

  loadZones(): void {
    this.zoneService.getAllZones().subscribe({
      next: (data) => {
        this.zones.set(data);
        if (data.length > 0) {
          this.newDevice.zone_id = data[0].id; // Set default to the first zone
        }
        toast.success('Zonas de cultivo cargadas correctamente');
      },
      error: (err) => {
        console.error('Error al cargar zonas de cultivo', err);
        toast.error('Error al cargar zonas de cultivo');
      }
    });
  }

  addDevice(): void {
    this.deviceService.createDevice(this.newDevice).subscribe({
      next: (device) => {
        this.devices.update(devs => [...devs, device]);
        toast.success('Dispositivo agregado correctamente');
        this.resetNewDeviceForm();
      },
      error: (err) => {
        console.error('Error al agregar dispositivo', err);
        toast.error('Error al agregar dispositivo');
      }
    });
  }

  viewDetails(id: number): void {
    this.deviceService.getDeviceById(id).subscribe({
      next: (device) => {
        this.selectedDevice.set(device);
        toast.info(`Detalles de ${device.name} cargados`);
      },
      error: (err) => {
        console.error(`Error al cargar detalles del dispositivo ${id}`, err);
        toast.error('Error al cargar detalles del dispositivo');
      }
    });
  }

  startEdit(device: Device): void {
    this.editingDevice.set({ ...device }); // Create a copy to avoid direct mutation
  }

  saveEdit(): void {
    const deviceToUpdate = this.editingDevice();
    if (deviceToUpdate && deviceToUpdate.id !== undefined) {
      const { id, created_at, updated_at, ...updatePayload } = deviceToUpdate; // Exclude id, created_at, updated_at
      this.deviceService.updateDevice(id, updatePayload as UpdateDevice).subscribe({
        next: (updatedDevice) => {
          this.devices.update(devs => devs.map(d => d.id === updatedDevice.id ? updatedDevice : d));
          this.editingDevice.set(null);
          this.selectedDevice.set(null); // Clear selected details if editing was initiated from there
          toast.success('Dispositivo actualizado correctamente');
        },
        error: (err) => {
          console.error('Error al actualizar dispositivo', err);
          toast.error('Error al actualizar dispositivo');
        }
      });
    }
  }

  cancelEdit(): void {
    this.editingDevice.set(null);
  }

  deleteDevice(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este dispositivo?')) {
      this.deviceService.deleteDevice(id).subscribe({
        next: () => {
          this.devices.update(devs => devs.filter(d => d.id !== id));
          this.selectedDevice.set(null); // Clear selected details if the deleted device was selected
          this.editingDevice.set(null); // Clear editing if the deleted device was being edited
          toast.success('Dispositivo eliminado correctamente');
        },
        error: (err) => {
          console.error(`Error al eliminar dispositivo ${id}`, err);
          toast.error('Error al eliminar dispositivo');
        }
      });
    }
  }

  resetNewDeviceForm(): void {
    this.newDevice = {
      name: '',
      device_type: '',
      serial_number: '',
      firmware_version: '',
      is_online: false,
      zone_id: this.zones().length > 0 ? this.zones()[0].id : 0 // Set default to the first zone or 0
    };
  }

  toggleZoneCreation(): void {
    this.showZoneCreation = !this.showZoneCreation;
  }

  toggleFarmCreation(): void {
    this.showFarmCreation = !this.showFarmCreation;
  }

  toggleParcelCreation(): void {
    this.showParcelCreation = !this.showParcelCreation;
  }

  createZone(): void {
    this.zoneService.createZone(this.newZone).subscribe({
      next: (zone) => {
        this.zones.update(zones => [...zones, zone]);
        toast.success('Zona de cultivo creada correctamente');
        this.resetNewZoneForm();
        this.showZoneCreation = false; // Hide the form after creation
      },
      error: (err) => {
        console.error('Error al crear zona de cultivo', err);
        toast.error('Error al crear zona de cultivo');
      }
    });
  }

  createFarm(): void {
    this.farmService.createFarm(this.newFarm).subscribe({
      next: (farm) => {
        this.farms.update(farms => [...farms, farm]);
        toast.success('Granja creada correctamente');
        this.resetNewFarmForm();
        this.showFarmCreation = false; // Hide the form after creation
      },
      error: (err) => {
        console.error('Error al crear granja', err);
        toast.error('Error al crear granja');
      }
    });
  }

  createParcel(): void {
    this.parcelService.createParcel(this.newParcel).subscribe({
      next: (parcel) => {
        this.parcels.update(parcels => [...parcels, parcel]);
        toast.success('Parcela creada correctamente');
        this.resetNewParcelForm();
        this.showParcelCreation = false; // Hide the form after creation
      },
      error: (err) => {
        console.error('Error al crear parcela', err);
        toast.error('Error al crear parcela');
      }
    });
  }

  resetNewZoneForm(): void {
    this.newZone = {
      name: '',
      crop_type: '',
      description: '',
      area_m2: 0,
      parcel_id: this.parcels().length > 0 ? this.parcels()[0].id : 0
    };
  }

  resetNewFarmForm(): void {
    this.newFarm = {
      name: '',
      location: '',
      description: ''
    };
  }

  resetNewParcelForm(): void {
    this.newParcel = {
      name: '',
      description: '',
      area_hectares: 0,
      farm_id: this.farms().length > 0 ? this.farms()[0].id : 0
    };
  }
}
