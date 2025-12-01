import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AgropreLogoComponent } from '@shared/components/agropre-logo/agropre-logo.component';
import { ZardIconComponent } from '@shared/components/icon/icon.component';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, AgropreLogoComponent, ZardIconComponent],
  template: `
    <footer class="relative overflow-hidden border-t border-slate-200 bg-slate-950 text-white/70">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute -top-24 right-10 h-64 w-64 rounded-full bg-emerald-500/20 blur-[120px]"></div>
        <div class="absolute bottom-0 left-6 h-72 w-72 rounded-full bg-sky-500/15 blur-[120px]"></div>
        <div class="absolute inset-8 rounded-[40px] border border-white/10"></div>
      </div>

      <div class="relative container mx-auto grid gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_1fr_1fr] lg:px-8">
        <div class="space-y-5">
          <div class="flex items-center gap-4">
            <div class="rounded-3xl bg-white/10 p-3">
              <app-agropre-logo [size]="42" className="drop-shadow-lg" />
            </div>
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.4em] text-white/50">AgroPre</p>
              <p class="text-2xl font-semibold text-white">UniverseThing</p>
            </div>
          </div>
          <p class="text-sm text-white/70">
            Sensamos, analizamos y automatizamos datos en tiempo real para anticipar riesgos, proteger cultivos y hacer visible cada hect&aacute;rea con IoT.
          </p>
          <div class="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
            <span class="rounded-full border border-white/20 px-3 py-1">IA</span>
            <span class="rounded-full border border-white/20 px-3 py-1">Clima</span>
            <span class="rounded-full border border-white/20 px-3 py-1">Visi&oacute;n</span>
          </div>
        </div>

        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.4em] text-white/50">Navegaci&oacute;n</p>
          <ul class="mt-4 space-y-2 text-sm">
            <li><a routerLink="/dashboard" class="transition hover:text-white">Dashboard</a></li>
            <li><a routerLink="/alertas" class="transition hover:text-white">Alertas</a></li>
            <li><a routerLink="/camaras" class="transition hover:text-white">Camaras</a></li>
            <li><a routerLink="/datos" class="transition hover:text-white">Datos</a></li>
            <li><a routerLink="/devices" class="transition hover:text-white">Dispositivos</a></li>
          </ul>
        </div>

        <div class="space-y-4 text-sm">
          <p class="text-sm font-semibold uppercase tracking-[0.4em] text-white/50">Contacto 24/7</p>
          <div class="space-y-3">
            <p class="flex items-center gap-2">
              <z-icon zType="mail" zSize="sm"></z-icon>
              soporte@agropre.io
            </p>
            <p class="flex items-center gap-2">
              <z-icon zType="layers" zSize="sm"></z-icon>
              Medell&iacute;n - LATAM
            </p>
          </div>
          <div class="flex gap-3 text-white/70">
            <a href="#" class="rounded-full border border-white/15 p-2 transition hover:border-white/40 hover:text-white">
              <z-icon zType="sparkles" zSize="sm"></z-icon>
            </a>
            <a href="#" class="rounded-full border border-white/15 p-2 transition hover:border-white/40 hover:text-white">
              <z-icon zType="heart" zSize="sm"></z-icon>
            </a>
            <a href="#" class="rounded-full border border-white/15 p-2 transition hover:border-white/40 hover:text-white">
              <z-icon zType="zap" zSize="sm"></z-icon>
            </a>
          </div>
        </div>
      </div>

      <div class="relative border-t border-white/10">
        <div class="container mx-auto flex flex-col gap-3 px-4 py-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>&copy; 2025 AgroPre. Construido para UniverseThing.</p>
          <div class="flex flex-wrap gap-4">
            <a href="#" class="transition hover:text-white">Privacidad</a>
            <a href="#" class="transition hover:text-white">T&eacute;rminos</a>
            <a href="#" class="transition hover:text-white">Estado</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: ``
})
export class FooterComponent {

}
