import {Component, inject} from '@angular/core';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardIconComponent } from '@shared/components/icon/icon.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [
    ZardButtonComponent,
    ZardIconComponent
  ],
  template: `
    <div class="relative isolate flex min-h-[70vh] items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white px-4 py-16 sm:px-6 lg:px-8">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute -top-20 right-0 h-80 w-80 rounded-full bg-sky-200/40 blur-[150px]"></div>
        <div class="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-emerald-200/40 blur-[160px]"></div>
      </div>

      <div class="relative mx-auto flex max-w-4xl flex-col items-center gap-8 rounded-[40px] border border-white/60 bg-white/80 p-8 text-center shadow-2xl shadow-sky-100/60 backdrop-blur">
        <div class="rounded-full border border-slate-200 bg-white/70 p-4 text-primary">
          <z-icon zType="layers" zSize="lg"></z-icon>
        </div>
        <div class="space-y-4">
          <p class="text-xs font-semibold uppercase tracking-[0.4em] text-primary/70">404</p>
          <h1 class="text-4xl font-semibold text-foreground sm:text-5xl">No encontramos esta ruta</h1>
          <p class="text-base text-muted-foreground">
            El enlace que abriste no existe o fue movido. Regresa al panel para continuar monitoreando tus dispositivos y alertas.
          </p>
        </div>
        <button z-button zType="default" zSize="lg" class="shadow-lg shadow-primary/20" (click)="goToDashboard()">
          Volver al dashboard
        </button>
      </div>
    </div>
  `,
  styles: ``
})
export class NotFoundComponent {

  private router = inject(Router);

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

}
