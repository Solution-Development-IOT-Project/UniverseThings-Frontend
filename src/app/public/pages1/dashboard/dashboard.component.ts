import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardIconComponent } from '@shared/components/icon/icon.component';
import { NotificationService } from '../services/notification.service';
import { Notification, NewNotification } from '../models/notification.model';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ZardButtonComponent, ZardIconComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  notifications = signal<Notification[]>([]);
  selectedNotification = signal<Notification | null>(null);
  isLoading = signal(false);
  filter = signal<'all' | 'unread' | 'read'>('all');

  filteredNotifications = computed(() => {
    const list = this.notifications();
    const filter = this.filter();
    if (filter === 'read') {
      return list.filter((notification) => notification.is_read);
    }
    if (filter === 'unread') {
      return list.filter((notification) => !notification.is_read);
    }
    return list;
  });

  unreadCount = computed(() =>
    this.notifications().filter((notification) => !notification.is_read).length
  );

  newNotification: NewNotification = this.buildEmptyNotification();

  constructor(private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  private buildEmptyNotification(): NewNotification {
    return {
      title: '',
      message: '',
      notification_type: 'alert',
      channel: '',
      user_id: undefined
    };
  }

  private resetNewNotificationForm(): void {
    this.newNotification = this.buildEmptyNotification();
  }

  loadNotifications(): void {
    this.isLoading.set(true);
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        this.notifications.set(data);
      },
      error: (err) => {
        console.error('Error al cargar notificaciones', err);
        toast.error('No se pudieron cargar las notificaciones');
      },
      complete: () => this.isLoading.set(false)
    });
  }

  setFilter(value: 'all' | 'unread' | 'read'): void {
    this.filter.set(value);
  }

  selectNotification(notification: Notification): void {
    this.selectedNotification.set(notification);
  }

  createNotification(): void {
    if (!this.newNotification.title.trim() || !this.newNotification.message.trim()) {
      toast.error('El titulo y el mensaje son obligatorios');
      return;
    }

    const payload: NewNotification = {
      title: this.newNotification.title.trim(),
      message: this.newNotification.message.trim(),
      notification_type: this.newNotification.notification_type.trim()
    };

    if (this.newNotification.channel && this.newNotification.channel.trim()) {
      payload.channel = this.newNotification.channel.trim();
    }

    if (this.newNotification.user_id) {
      payload.user_id = this.newNotification.user_id;
    }

    this.notificationService.createNotification(payload).subscribe({
      next: (notification) => {
        this.notifications.update((list) => [notification, ...list]);
        toast.success('Notificacion creada correctamente');
        this.resetNewNotificationForm();
      },
      error: (err) => {
        console.error('Error al crear notificacion', err);
        toast.error('No se pudo crear la notificacion');
      }
    });
  }

  markAsRead(notification: Notification): void {
    if (notification.is_read) {
      return;
    }

    this.notificationService.markAsRead(notification.id).subscribe({
      next: (updated) => {
        this.notifications.update((list) =>
          list.map((item) => (item.id === updated.id ? updated : item))
        );
        if (this.selectedNotification()?.id === updated.id) {
          this.selectedNotification.set(updated);
        }
        toast.success('Notificacion marcada como leida');
      },
      error: (err) => {
        console.error('Error al marcar notificacion', err);
        toast.error('No se pudo marcar la notificacion');
      }
    });
  }

  deleteNotification(notification: Notification): void {
    if (!confirm('Estas seguro de que deseas eliminar esta notificacion?')) {
      return;
    }

    this.notificationService.deleteNotification(notification.id).subscribe({
      next: () => {
        this.notifications.update((list) =>
          list.filter((item) => item.id !== notification.id)
        );
        if (this.selectedNotification()?.id === notification.id) {
          this.selectedNotification.set(null);
        }
        toast.success('Notificacion eliminada correctamente');
      },
      error: (err) => {
        console.error('Error al eliminar notificacion', err);
        toast.error('No se pudo eliminar la notificacion');
      }
    });
  }

  refreshNotificationList(): void {
    this.loadNotifications();
  }

  trackByNotification = (_: number, notification: Notification): number => notification.id;

  getFilterButtonType(filterValue: 'all' | 'unread' | 'read'): 'default' | 'secondary' | 'ghost' {
    const current = this.filter();
    if (filterValue === 'all') {
      return current === 'all' ? 'default' : 'ghost';
    }
    if (filterValue === 'unread') {
      return current === 'unread' ? 'secondary' : 'ghost';
    }
    return current === 'read' ? 'secondary' : 'ghost';
  }
}
