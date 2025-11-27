import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeviceService } from '../services/device.service';
import { ZoneService } from '../services/zone.service'; // Import ZoneService
import { Device, NewDevice, UpdateDevice } from '../models/device.model';
import { Zone } from '../models/zone.model'; // Import Zone model
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
  zones = signal<Zone[]>([]); // New signal for zones
  selectedDevice = signal<Device | null>(null);
  editingDevice = signal<Device | null>(null); // New signal for editing
  newDevice: NewDevice = {
    name: '',
    device_type: '',
    serial_number: '',
    firmware_version: '',
    is_online: false,
    zone_id: 0
  };

  constructor(
    private deviceService: DeviceService,
    private zoneService: ZoneService // Inject ZoneService
  ) { }

  ngOnInit(): void {
    this.loadDevices();
    this.loadZones();
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
}
