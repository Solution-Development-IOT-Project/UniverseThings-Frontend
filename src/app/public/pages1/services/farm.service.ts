import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Farm, NewFarm } from '../models/farm.model';

@Injectable({
  providedIn: 'root'
})
export class FarmService {
  private apiUrl = `${environment.apiUrl}/farms`;

  constructor(private http: HttpClient) { }


  getAllFarms(): Observable<Farm[]> {
    return this.http.get<Farm[]>(this.apiUrl);
  }

  createFarm(farm: NewFarm): Observable<Farm> {
    return this.http.post<Farm>(this.apiUrl, farm);
  }
}
