import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Zone, NewZone } from '../models/zone.model';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  private apiUrl = `${environment.apiUrl}/zones`;

  constructor(private http: HttpClient) { }

  getAllZones(): Observable<Zone[]> {
    return this.http.get<Zone[]>(this.apiUrl);
  }

  // You can add other CRUD operations for zones here if needed in the future
  createZone(zone: NewZone): Observable<Zone> {
    return this.http.post<Zone>(this.apiUrl, zone);
  }
}
