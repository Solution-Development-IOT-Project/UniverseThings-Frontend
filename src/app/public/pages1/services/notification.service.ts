import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Notification, NewNotification, UpdateNotification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) { }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl);
  }

  getNotification(id: number): Observable<Notification> {
    return this.http.get<Notification>(`${this.apiUrl}/${id}`);
  }

  createNotification(payload: NewNotification): Observable<Notification> {
    return this.http.post<Notification>(this.apiUrl, payload);
  }

  updateNotification(id: number, payload: UpdateNotification): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/${id}`, payload);
  }

  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  markAsRead(id: number): Observable<Notification> {
    return this.http.post<Notification>(`${this.apiUrl}/${id}/read`, {});
  }
}
