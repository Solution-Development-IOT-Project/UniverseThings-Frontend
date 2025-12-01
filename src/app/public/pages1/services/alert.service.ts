import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Alert, NewAlert, UpdateAlert } from '../models/alert.model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private readonly apiUrl = `${environment.apiUrl}/alerts`;

  constructor(private http: HttpClient) { }

  getAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(this.apiUrl);
  }

  getAlert(id: number): Observable<Alert> {
    return this.http.get<Alert>(`${this.apiUrl}/${id}`);
  }

  createAlert(payload: NewAlert): Observable<Alert> {
    return this.http.post<Alert>(this.apiUrl, payload);
  }

  updateAlert(id: number, payload: UpdateAlert): Observable<Alert> {
    return this.http.put<Alert>(`${this.apiUrl}/${id}`, payload);
  }

  deleteAlert(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  markAlertRead(id: number): Observable<Alert> {
    return this.http.post<Alert>(`${this.apiUrl}/${id}/read`, {});
  }
}
