import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Parcel, NewParcel } from '../models/parcel.model';

@Injectable({
  providedIn: 'root'
})
export class ParcelService {
  private apiUrl = `${environment.apiUrl}/parcels`;

  constructor(private http: HttpClient) { }

  getAllParcels(): Observable<Parcel[]> {
    return this.http.get<Parcel[]>(this.apiUrl);
  }

  createParcel(parcel: NewParcel): Observable<Parcel> {
    return this.http.post<Parcel>(this.apiUrl, parcel);
  }
}
