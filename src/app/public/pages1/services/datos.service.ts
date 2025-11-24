import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// 🔥 Tipo de sensor que usarás en tu app
export type TipoSensor = 'temperatura' | 'luz' | 'sensores';

// 🔥 Modelo base para todos los sensores
export interface DatosSensor {
  valorActual: number;
  promedio: number;
  maximo: number;
  unidad: string;
  historial: number[];
  distribucion: number[];
}

@Injectable({ providedIn: 'root' })
export class DatosService {

  private apiUrl = 'https://tu-backend.com/api/datos';

  constructor(private http: HttpClient) {}

  // 🔥 Mock con datos realistas según tipo de sensor
  obtenerDatosMock(sensor: TipoSensor): DatosSensor {

    const base: Record<TipoSensor, DatosSensor> = {

      temperatura: {
        valorActual: 24.5,
        promedio: 22.1,
        maximo: 26.3,
        unidad: '°C',
        historial: [20, 22, 25, 24, 23],
        distribucion: [40, 35, 25]
      },

      luz: {
        valorActual: 82,
        promedio: 79,
        maximo: 90,
        unidad: '%',
        historial: [60, 75, 82, 80, 88],
        distribucion: [30, 50, 20] // mañana / tarde / noche
      },

      sensores: {
        valorActual: 17, // activos
        promedio: 16,
        maximo: 20,
        unidad: ' activos',
        historial: [10, 12, 15, 18, 17],
        distribucion: [85, 10, 5] // activos / inactivos / inoperativos
      }
    };

    return base[sensor];
  }

  // 🔥 Método HTTP real
  obtenerDatosReales(sensor: TipoSensor) {
    return this.http.get(`${this.apiUrl}/${sensor}`);
  }
}
