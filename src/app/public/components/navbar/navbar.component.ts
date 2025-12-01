import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';

type NavLink = {
  label: string;
  path: string;
  badge?: string;
  exact?: boolean;
};
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { AgropreLogoComponent } from '@shared/components/agropre-logo/agropre-logo.component';


@Component({

  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    NgFor,
    NgIf,
    ZardButtonComponent,
    AgropreLogoComponent
  ],
  template: `
    <header class="sticky top-0 z-50 border-b border-white/60 bg-white/80 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-white/65">
      <div class="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-4">
          <div class="rounded-3xl bg-primary/10 p-3 ring-1 ring-primary/10">
            <app-agropre-logo [size]="40" />
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.4em] text-primary/80">AgroPre</p>
            <p class="text-lg font-semibold text-foreground">UniverseThing IoT</p>
          </div>
        </div>

        <nav class="order-3 flex w-full flex-wrap items-center justify-center gap-2 text-sm font-medium text-muted-foreground md:order-none md:w-auto">
            <a
              *ngFor="let link of navLinks"
              [routerLink]="link.path"
              routerLinkActive="text-primary bg-primary/10 shadow-lg shadow-primary/10"
              [routerLinkActiveOptions]="{ exact: !!link.exact }"
              class="inline-flex items-center gap-1 rounded-full border border-transparent px-4 py-1.5 transition hover:border-primary/30 hover:text-foreground">
              {{ link.label }}
              <span *ngIf="link.badge" class="rounded-full bg-primary/15 px-2 text-[11px] uppercase tracking-wide text-primary">{{ link.badge }}</span>
            </a>
        </nav>

        <div class="flex items-center gap-2">
          <button
            z-button
            zType="ghost"
            class="hidden text-muted-foreground transition hover:text-foreground md:inline-flex"
            (click)="navigateTo('/camaras')">
            Ver c&aacute;maras
          </button>
          <button
            z-button
            zSize="lg"
            class="shadow-lg shadow-primary/25"
            (click)="navigateTo('/devices')">
            Panel IoT
          </button>
        </div>
      </div>
    </header>
  `,
  styles: ``
})
export class NavbarComponent {

  protected readonly navLinks: readonly NavLink[] = [
    { label: 'Dashboard', path: '/dashboard', exact: true },
    { label: 'Camaras', path: '/camaras' },
    { label: 'Alertas', path: '/alertas', badge: 'Live' },
    { label: 'Datos', path: '/datos' },
    { label: 'Dispositivos', path: '/devices' }
  ];

  constructor(private router: Router) {
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

}
