import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alerta } from '../models/alerta.model';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  private apiUrl = 'http://localhost:3000/api/alertas'; // Cambia por tu backend

  constructor(private http: HttpClient) {}

  getAlertas(): Observable<Alerta[]> {
    return this.http.get<Alerta[]>(this.apiUrl);
  }

  resolverAlerta(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/resolver`, {});
  }

  obtenerDetalle(id: number): Observable<Alerta> {
    return this.http.get<Alerta>(`${this.apiUrl}/${id}`);
  }
}
