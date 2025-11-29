import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Camera, CameraImage, NewCamera, UpdateCamera } from '../models/camera.model';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private readonly apiUrl = `${environment.apiUrl}/cameras`;

  constructor(private http: HttpClient) { }

  getCameras(): Observable<Camera[]> {
    return this.http.get<Camera[]>(this.apiUrl);
  }

  getCamera(id: number): Observable<Camera> {
    return this.http.get<Camera>(`${this.apiUrl}/${id}`);
  }

  createCamera(payload: NewCamera): Observable<Camera> {
    return this.http.post<Camera>(this.apiUrl, payload);
  }

  updateCamera(id: number, payload: UpdateCamera): Observable<Camera> {
    return this.http.put<Camera>(`${this.apiUrl}/${id}`, payload);
  }

  deleteCamera(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getImages(cameraId: number, limit = 50): Observable<CameraImage[]> {
    const params = new HttpParams().set('limit', limit);
    return this.http.get<CameraImage[]>(`${this.apiUrl}/${cameraId}/images`, { params });
  }
}
