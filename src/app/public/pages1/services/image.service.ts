import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CameraImage, NewCameraImage, UpdateCameraImage } from '../models/camera.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly apiUrl = `${environment.apiUrl}/images`;

  constructor(private http: HttpClient) { }

  getImages(): Observable<CameraImage[]> {
    return this.http.get<CameraImage[]>(this.apiUrl);
  }

  getImageById(id: number): Observable<CameraImage> {
    return this.http.get<CameraImage>(`${this.apiUrl}/${id}`);
  }

  createImage(payload: NewCameraImage): Observable<CameraImage> {
    return this.http.post<CameraImage>(this.apiUrl, payload);
  }

  updateImage(id: number, payload: UpdateCameraImage): Observable<CameraImage> {
    return this.http.put<CameraImage>(`${this.apiUrl}/${id}`, payload);
  }

  deleteImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
