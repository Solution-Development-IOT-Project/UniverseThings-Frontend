import { Component, OnInit, signal, computed } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DatosService, TipoSensor } from '../services/datos.service';
import { ZardToastComponent } from '@shared/components/toast/toast.component';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { toast } from 'ngx-sonner';

import {
  ApexChart,
  ApexStroke,
  ApexXAxis,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
} from 'ng-apexcharts';

@Component({
  selector: 'app-datos',
  standalone: true,
  imports: [NgApexchartsModule, ZardToastComponent, ZardButtonComponent],
  template: `
    <div class="container mx-auto px-6 py-8">

      <!-- Título -->
      <h1 class="text-3xl font-bold text-foreground mb-6">Panel de Datos</h1>

      <!-- PANEL EXTRA SUPERIOR -->
<div class="grid grid-cols-4 gap-4 mb-6">

  <div class="rounded-xl p-5 shadow bg-white">
    <h3 class="text-sm text-gray-500">Temp. Promedio</h3>
    <p class="text-2xl font-semibold text-green-600">24.5°C</p>
    <p class="text-xs text-green-500">↗ +1.2°C vs ayer</p>
  </div>

  <div class="rounded-xl p-5 shadow bg-white">
    <h3 class="text-sm text-gray-500">Luz Promedio</h3>
    <p class="text-2xl font-semibold text-blue-600">82%</p>
    <p class="text-xs text-blue-500">↗ +5% vs ayer</p>
  </div>

  <div class="rounded-xl p-5 shadow bg-white">
    <h3 class="text-sm text-gray-500">Sensores Activos</h3>
    <p class="text-2xl font-semibold text-green-600">17/20</p>
    <p class="text-xs text-green-500">85% operativos</p>
  </div>

  <div class="rounded-xl p-5 shadow bg-white">
    <h3 class="text-sm text-gray-500">Ahorro Insecticida</h3>
    <p class="text-2xl font-semibold text-orange-600">+32%</p>
    <p class="text-xs text-orange-500">vs mes anterior</p>
  </div>

</div>
<!-- FIN PANEL EXTRA SUPERIOR -->


      <!-- Selector de sensor -->
      <div class="flex gap-3 mb-6 flex-wrap">
        <button z-button zType="default" (click)="cambiarSensor('temperatura')">Temperatura</button>
        <button z-button zType="default" (click)="cambiarSensor('luz')">Luz</button>
        <button z-button zType="default" (click)="cambiarSensor('sensores')">Sensores</button>
        <button z-button zType="outline" (click)="actualizarDatos()">Actualizar Datos</button>
      </div>

      <!-- Métricas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div class="p-6 bg-background rounded-xl shadow">
          <h3 class="text-muted-foreground text-sm mb-2">Valor actual</h3>
          <p class="text-3xl font-bold">{{ valorActual() }}{{ unidad() }}</p>
        </div>

        <div class="p-6 bg-background rounded-xl shadow">
          <h3 class="text-muted-foreground text-sm mb-2">Promedio diario</h3>
          <p class="text-3xl font-bold">{{ promedio() }}{{ unidad() }}</p>
        </div>

        <div class="p-6 bg-background rounded-xl shadow">
          <h3 class="text-muted-foreground text-sm mb-2">Máximo registrado</h3>
          <p class="text-3xl font-bold">{{ maximo() }}{{ unidad() }}</p>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <!-- Línea -->
        <div class="bg-background p-6 rounded-xl shadow">
          <h2 class="text-xl font-bold mb-4">Evolución del sensor</h2>
          <apx-chart
            [series]="lineSeries()"
            [chart]="lineChartOptions.chart"
            [xaxis]="lineChartOptions.xaxis"
            [stroke]="lineChartOptions.stroke"
            [colors]="lineChartOptions.colors"
            class="chart-box">
          </apx-chart>
        </div>

        <!-- Donut -->
        <div class="bg-background p-6 rounded-xl shadow">
          <h2 class="text-xl font-bold mb-4">Distribución del día</h2>
          <apx-chart
            [series]="donutSeries()"
            [chart]="donutOptions.chart"
            [labels]="donutOptions.labels"
            [colors]="donutOptions.colors"
            class="chart-box">
          </apx-chart>
        </div>

      </div>

    </div>
  `,
  styles: `
    .chart-box {
      max-width: 100%;
      margin: auto;
    }

    @media (min-width: 1024px) {
      .chart-box {
        width: 90%;
      }
    }
  `,
})
export class DatosComponent implements OnInit {

  constructor(private datosService: DatosService) {}

  sensorSeleccionado = signal<TipoSensor>('temperatura');

  datos = computed(() => this.datosService.obtenerDatosMock(this.sensorSeleccionado()));
  valorActual = computed(() => this.datos().valorActual);
  promedio = computed(() => this.datos().promedio);
  maximo = computed(() => this.datos().maximo);
  unidad = computed(() => this.datos().unidad);

  lineSeries = computed<ApexAxisChartSeries>(() => [
    { name: 'Lecturas', data: this.datos().historial }
  ]);

  donutSeries = computed<ApexNonAxisChartSeries>(() => this.datos().distribucion);

  lineChartOptions = {
    chart: { type: 'line' as const, height: 350 },
    xaxis: { categories: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM'] },
    stroke: { curve: 'smooth' as const, width: 3 },
    colors: ['#0084ff'],
  };

  donutOptions = {
    chart: { type: 'donut' as const },
    labels: ['Mañana', 'Tarde', 'Noche'],
    colors: ['#00C9A7', '#FFC75F', '#FF6F91'],
  };

  ngOnInit() {
    toast.success('Datos cargados correctamente');
  }

  cambiarSensor(tipo: TipoSensor) {
    this.sensorSeleccionado.set(tipo);
    toast.success(`Sensor cambiado a ${tipo}`);
  }

  actualizarDatos() {
    toast.success('Datos actualizados correctamente.');
  }
}
