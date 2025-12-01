import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardToastComponent } from '@shared/components/toast/toast.component';
import { ZardIconComponent } from '@shared/components/icon/icon.component';
import { AlertService } from '../services/alert.service';
import { Alert, NewAlert } from '../models/alert.model';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [CommonModule, FormsModule, ZardButtonComponent, ZardToastComponent, ZardIconComponent],
  templateUrl: './alertas.component.html',
  styleUrl: './alertas.component.css'
})
export class AlertasComponent implements OnInit {
  alerts = signal<Alert[]>([]);
  selectedAlert = signal<Alert | null>(null);
  filter = signal<'all' | 'unread' | 'resolved'>('all');
  severityFilter = signal<'all' | 'info' | 'warning' | 'critical'>('all');
  isLoading = signal(false);

  filteredAlerts = computed(() => {
    const list = this.alerts();
    const status = this.filter();
    const severity = this.severityFilter();

    return list.filter(alert => {
      const matchesStatus =
        status === 'all'
          ? true
          : status === 'resolved'
            ? Boolean(alert.resolved_at)
            : !alert.is_read;

      const matchesSeverity = severity === 'all' ? true : alert.severity === severity;
      return matchesStatus && matchesSeverity;
    });
  });

  unreadCount = computed(() => this.alerts().filter(alert => !alert.is_read).length);
  resolvedCount = computed(() => this.alerts().filter(alert => Boolean(alert.resolved_at)).length);

  newAlert: NewAlert = this.buildEmptyAlert();

  constructor(private readonly alertService: AlertService) { }

  ngOnInit(): void {
    this.loadAlerts();
  }

  private buildEmptyAlert(): NewAlert {
    return {
      message: '',
      details: '',
      severity: 'info',
      is_read: false
    };
  }

  private resetNewAlertForm(): void {
    this.newAlert = this.buildEmptyAlert();
  }

  loadAlerts(): void {
    this.isLoading.set(true);
    this.alertService.getAlerts().subscribe({
      next: (data) => {
        this.alerts.set(data);
      },
      error: (err) => {
        console.error('Error al cargar alertas', err);
        toast.error('No se pudieron cargar las alertas');
      },
      complete: () => this.isLoading.set(false)
    });
  }

  setFilter(value: 'all' | 'unread' | 'resolved'): void {
    this.filter.set(value);
  }

  setSeverityFilter(value: 'all' | 'info' | 'warning' | 'critical'): void {
    this.severityFilter.set(value);
  }

  handleSeverityChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    const value = (target?.value || 'all') as 'all' | 'info' | 'warning' | 'critical';
    this.setSeverityFilter(value);
  }

  selectAlert(alert: Alert): void {
    this.selectedAlert.set(alert);
  }

  createAlert(): void {
    if (!this.newAlert.message.trim()) {
      toast.error('El mensaje es obligatorio');
      return;
    }

    const payload: NewAlert = {
      message: this.newAlert.message.trim(),
      details: this.newAlert.details?.trim() || '',
      severity: this.newAlert.severity,
      is_read: false
    };

    const zone = Number(this.newAlert.zone_id);
    if (!Number.isNaN(zone) && zone > 0) {
      payload.zone_id = zone;
    }

    const sensor = Number(this.newAlert.sensor_id);
    if (!Number.isNaN(sensor) && sensor > 0) {
      payload.sensor_id = sensor;
    }

    this.alertService.createAlert(payload).subscribe({
      next: (alert) => {
        this.alerts.update((list) => [alert, ...list]);
        toast.success('Alerta creada correctamente');
        this.resetNewAlertForm();
      },
      error: (err) => {
        console.error('Error al crear alerta', err);
        toast.error('No se pudo crear la alerta');
      }
    });
  }

  markAsRead(alert: Alert): void {
    if (alert.is_read) {
      return;
    }

    this.alertService.markAlertRead(alert.id).subscribe({
      next: (updated) => {
        this.alerts.update((list) =>
          list.map((item) => (item.id === updated.id ? updated : item))
        );
        if (this.selectedAlert()?.id === updated.id) {
          this.selectedAlert.set(updated);
        }
        toast.success('Alerta marcada como leída');
      },
      error: (err) => {
        console.error('Error al marcar alerta', err);
        toast.error('No se pudo marcar la alerta');
      }
    });
  }

  resolveAlert(alert: Alert): void {
    if (alert.resolved_at) {
      return;
    }

    this.alertService.updateAlert(alert.id, {
      resolved_at: new Date().toISOString(),
      is_read: true
    }).subscribe({
      next: (updated) => {
        this.alerts.update((list) =>
          list.map((item) => (item.id === updated.id ? updated : item))
        );
        if (this.selectedAlert()?.id === updated.id) {
          this.selectedAlert.set(updated);
        }
        toast.success('Alerta marcada como resuelta');
      },
      error: (err) => {
        console.error('Error al resolver alerta', err);
        toast.error('No se pudo resolver la alerta');
      }
    });
  }

  deleteAlert(alert: Alert): void {
    if (!confirm('Estas seguro de eliminar esta alerta?')) {
      return;
    }

    this.alertService.deleteAlert(alert.id).subscribe({
      next: () => {
        this.alerts.update((list) => list.filter((item) => item.id !== alert.id));
        if (this.selectedAlert()?.id === alert.id) {
          this.selectedAlert.set(null);
        }
        toast.success('Alerta eliminada');
      },
      error: (err) => {
        console.error('Error al eliminar alerta', err);
        toast.error('No se pudo eliminar la alerta');
      }
    });
  }

  refreshAlerts(): void {
    this.loadAlerts();
  }

  trackByAlert = (_: number, alert: Alert): number => alert.id;
}
