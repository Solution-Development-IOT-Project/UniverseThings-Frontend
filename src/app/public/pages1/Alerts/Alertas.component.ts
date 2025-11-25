import { Component, signal, computed } from '@angular/core';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardToastComponent } from '@shared/components/toast/toast.component';
import { toast } from 'ngx-sonner';
import { NgFor } from '@angular/common';


type TipoAlerta = 'Helada' | 'Control de Plagas' | 'Mantenimiento';
type EstadoAlerta = 'Activa' | 'Pendiente' | 'Resuelta';

interface Alerta {
  id: number;
  tipo: TipoAlerta;
  estado: EstadoAlerta;
  fecha: string;
  descripcion: string;
}

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [ZardButtonComponent, ZardToastComponent, NgFor],
  template: `
    <z-toaster></z-toaster>

    <div class="alertas-container">

      <!-- TÍTULO -->
      <h2 class="titulo">Panel de Alertas</h2>

      <!-- TARJETAS DE RESUMEN -->
      <div class="tarjetas">
        <div class="card">
          <p class="card-titulo">Alertas Activas</p>
          <p class="card-num">{{ activas() }}</p>
        </div>

        <div class="card">
          <p class="card-titulo">Pendientes</p>
          <p class="card-num">{{ pendientes() }}</p>
        </div>

        <div class="card">
          <p class="card-titulo">Resueltas Hoy</p>
          <p class="card-num">{{ resueltasHoy() }}</p>
        </div>

        <div class="card">
          <p class="card-titulo">Tiempo Resp. Promedio</p>
          <p class="card-num">12 min</p>
        </div>
      </div>

      <!-- HISTORIAL -->
      <h3 class="subtitulo">Historial de Alertas</h3>

      <!-- FILTROS -->
      <div class="filtros">
        <button z-button zType="default" (click)="setFiltro('todas')">Todas</button>
        <button z-button zType="outline" (click)="setFiltro('activas')">Activas</button>
        <button z-button zType="destructive" (click)="setFiltro('resueltas')">Resueltas</button>
      </div>

      <!-- LISTADO -->
      <div class="lista">
        <div *ngFor="let a of listaFiltrada()" class="item-alerta">
          <h4 class="item-titulo">{{ a.tipo }} — {{ a.estado }}</h4>
          <p class="item-desc">{{ a.descripcion }}</p>
          <p class="item-fecha">{{ a.fecha }}</p>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .alertas-container {
      width: 95%;
      max-width: 900px;
      margin: 20px auto;
    }

    .titulo {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 20px;
      text-align: center;
    }

    .tarjetas {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-bottom: 30px;
    }

    .card {
      background: #f4f4f4;
      padding: 18px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .card-titulo {
      font-size: 16px;
      opacity: 0.7;
    }

    .card-num {
      font-size: 32px;
      font-weight: bold;
    }

    .subtitulo {
      margin: 20px 0 10px;
      font-size: 22px;
      font-weight: 600;
    }

    .filtros {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }

    .lista {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .item-alerta {
      background: #ffffff;
      border: 1px solid #e2e2e2;
      padding: 14px;
      border-radius: 10px;
    }

    .item-titulo {
      font-size: 18px;
      font-weight: 600;
    }

    .item-desc {
      opacity: 0.8;
      margin: 4px 0;
    }

    .item-fecha {
      font-size: 13px;
      opacity: 0.6;
    }
  `]
})
export class AlertasComponent {

  // --- LISTA DE DATOS MOCK ---
  alertas = signal<Alerta[]>([
    {
      id: 1,
      tipo: 'Helada',
      estado: 'Activa',
      fecha: 'Hoy - 08:21 AM',
      descripcion: 'Temperatura bajó a 2°C en el cultivo de papa.'
    },
    {
      id: 2,
      tipo: 'Control de Plagas',
      estado: 'Pendiente',
      fecha: 'Ayer - 05:10 PM',
      descripcion: 'Actividad inusual detectada en sensores del maíz.'
    },
    {
      id: 3,
      tipo: 'Mantenimiento',
      estado: 'Resuelta',
      fecha: 'Hoy - 09:40 AM',
      descripcion: 'Sensor de humedad recalibrado exitosamente.'
    },
    {
      id: 4,
      tipo: 'Helada',
      estado: 'Resuelta',
      fecha: '07/11 - 11:50 AM',
      descripcion: 'Condiciones climáticas normalizadas.'
    }
  ]);

  // --- FILTRO ---
  filtro = signal<'todas' | 'activas' | 'resueltas'>('todas');

  setFiltro(valor: 'todas' | 'activas' | 'resueltas') {
    this.filtro.set(valor);
    toast(`Filtro aplicado: ${valor}`);
  }

  // --- COMPUTED PARA CONTADORES ---
  activas = computed(() =>
    this.alertas().filter(a => a.estado === 'Activa').length
  );

  pendientes = computed(() =>
    this.alertas().filter(a => a.estado === 'Pendiente').length
  );

  resueltasHoy = computed(() =>
    this.alertas().filter(a => a.estado === 'Resuelta' && a.fecha.includes('Hoy')).length
  );

  // --- LISTADO FILTRADO ---
  listaFiltrada = computed(() => {
    const tipo = this.filtro();
    const lista = this.alertas();

    if (tipo === 'activas') return lista.filter(a => a.estado === 'Activa');
    if (tipo === 'resueltas') return lista.filter(a => a.estado === 'Resuelta');
    return lista;
  });
}
