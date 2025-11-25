import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { toast } from 'ngx-sonner';

import { ZardFormModule } from '@shared/components/form/form.module';
import { ZardInputDirective } from '@shared/components/input/input.directive';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardIconComponent } from '@shared/components/icon/icon.component';
import { AgropreLogoComponent } from '@shared/components/agropre-logo/agropre-logo.component';
import { AuthService, LoginRequest } from '@shared/services/auth.service';
import { extractHttpErrorMessage } from '@shared/utils/http-error.util';

type LoginFormModel = {
  email: string;
  password: string;
};

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    ZardFormModule,
    ZardInputDirective,
    ZardButtonComponent,
    ZardIconComponent,
    AgropreLogoComponent,
    NgFor,
    RouterLink,
  ],
  template: `
    <section class="relative min-h-dvh overflow-hidden bg-[#f6fbf7] px-4 py-12 font-inter text-slate-900">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute -left-24 top-16 h-72 w-72 rounded-full bg-primary/20 blur-[140px]"></div>
        <div class="absolute bottom-0 right-10 h-96 w-96 rounded-full bg-sky-200/60 blur-[150px]"></div>
        <div class="absolute inset-6 rounded-[44px] border border-white/70"></div>
      </div>

      <div class="relative mx-auto grid max-w-6xl gap-8 rounded-[44px] border border-white/60 bg-white/70 p-6 shadow-2xl shadow-emerald-100/50 backdrop-blur-xl lg:grid-cols-[1.15fr_0.85fr] lg:p-12">
        <div class="space-y-10">
          <div class="flex flex-wrap items-center gap-4">
            <div class="rounded-3xl bg-primary/10 p-4 ring-1 ring-primary/20">
              <app-agropre-logo [size]="56" className="drop-shadow" />
            </div>
            <div>
              <p class="text-4xl font-semibold">AgroPre</p>
              <p class="text-xs font-semibold uppercase tracking-[0.5em] text-muted-foreground">UniverseThing</p>
            </div>
            <span class="rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Plataforma IoT Agricola
            </span>
          </div>

          <div class="space-y-4">
            <h1 class="text-4xl font-semibold leading-tight sm:text-5xl">
              Gestiona tus cultivos con tecnologia y analitica avanzada
            </h1>
            <p class="text-base text-muted-foreground">
              Centraliza sensores, detecta riesgos con IA y protege tus lotes dentro del ecosistema UniverseThing.
            </p>
          </div>

          <div class="space-y-4 rounded-[32px] border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-emerald-100">
            <p class="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Experiencia UniverseThing</p>
            <div class="grid gap-4">
              <div *ngFor="let highlight of heroHighlights" class="flex items-center gap-4">
                <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <z-icon [zType]="highlight.icon" zSize="lg"></z-icon>
                </span>
                <div>
                  <p class="text-base font-semibold">{{ highlight.title }}</p>
                  <p class="text-sm text-muted-foreground">{{ highlight.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="relative">
          <div class="pointer-events-none absolute -right-8 -top-8 hidden h-32 w-32 rounded-full bg-primary/20 blur-3xl sm:block"></div>
          <div class="relative rounded-[32px] border border-primary/15 bg-white/95 p-8 shadow-2xl shadow-primary/25 backdrop-blur">
            <div class="flex flex-wrap gap-3 text-sm font-medium">
              <span class="rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-primary shadow-sm">Iniciar sesion</span>
              <a routerLink="/register" class="rounded-full px-4 py-1 text-muted-foreground transition hover:text-primary">Registrarse</a>
            </div>

            <div class="mt-8 space-y-2">
              <p class="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Bienvenido de vuelta</p>
              <h2 class="text-3xl font-bold">Ingresa tus credenciales</h2>
              <p class="text-sm text-muted-foreground">Tus paneles se sincronizan al instante despues de iniciar sesion.</p>
            </div>

            <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="submit()">
              <z-form-field>
                <z-form-label zRequired="true">Email</z-form-label>
                <z-form-control [errorMessage]="controlInvalid('email') ? controlError('email') : ''">
                  <input
                    z-input
                    formControlName="email"
                    type="email"
                    placeholder="usuario@agropre.com"
                    autocomplete="email"
                    [zStatus]="controlInvalid('email') ? 'error' : undefined" />
                </z-form-control>
              </z-form-field>

              <z-form-field>
                <z-form-label zRequired="true">Contrasena</z-form-label>
                <z-form-control [errorMessage]="controlInvalid('password') ? controlError('password') : ''">
                  <input
                    z-input
                    formControlName="password"
                    type="password"
                    placeholder="••••••••"
                    autocomplete="current-password"
                    [zStatus]="controlInvalid('password') ? 'error' : undefined" />
                </z-form-control>
              </z-form-field>

              @if (serverError()) {
                <div class="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {{ serverError() }}
                </div>
              }

              <div class="flex flex-col gap-4">
                <button
                  z-button
                  zType="default"
                  zFull="true"
                  type="submit"
                  [disabled]="isSubmitting()"
                  [zLoading]="isSubmitting()">
                  Iniciar sesion
                </button>

                <p class="text-center text-sm text-muted-foreground">
                  ¿Olvidaste tu contrasena?
                  <button type="button" class="font-semibold text-primary hover:underline" (click)="contactSupport()">Recuperar</button>
                </p>
              </div>
            </form>

            <div class="mt-6 grid gap-3 rounded-2xl border border-slate-100 bg-muted/40 p-4 text-sm text-muted-foreground">
              <p class="text-sm font-semibold text-slate-900">Seguridad garantizada</p>
              <ul class="space-y-2 text-xs text-muted-foreground">
                <li *ngFor="let tip of securityTips" class="flex items-start gap-2">
                  <span class="mt-1 text-primary">•</span>
                  <span>{{ tip }}</span>
                </li>
              </ul>
              <p class="text-xs text-muted-foreground">Soporte dedicado: soporte@agropre.com</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected readonly heroHighlights = [
    {
      title: 'Sensores IoT',
      description: 'Monitoreo minuto a minuto para cada parcela.',
      icon: 'smartphone',
    },
    {
      title: 'Analisis IA',
      description: 'Modelos predictivos para anticipar heladas y plagas.',
      icon: 'sparkles',
    },
    {
      title: 'Proteccion activa',
      description: 'Alertas y protocolos automatizados para cada lote.',
      icon: 'shield',
    },
  ] as const;

  protected readonly securityTips = [
    'Sesiones cifradas con TLS 1.3',
    'Tokens expiran automaticamente cuando se detecta inactividad',
    'Compatible con politicas corporativas de Single Sign-On',
  ] as const;

  protected readonly isSubmitting = signal(false);
  protected readonly serverError = signal<string | null>(null);

  protected controlInvalid(controlName: keyof LoginFormModel): boolean {
    const control = this.loginForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  protected controlError(controlName: keyof LoginFormModel): string {
    const control = this.loginForm.controls[controlName];

    if (!control.errors) return '';
    if (control.errors['required']) return 'Este campo es obligatorio.';
    if (control.errors['email']) return 'Ingresa un email valido.';
    if (control.errors['minlength']) return 'Debe contener al menos 6 caracteres.';
    return 'Campo invalido.';
  }

  protected submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.serverError.set(null);

    const payload: LoginRequest = {
      email: this.loginForm.controls.email.value.trim(),
      password: this.loginForm.controls.password.value,
    };

    this.authService.login(payload).subscribe({
      next: () => {
        toast.success('Sesion iniciada correctamente.');
        this.isSubmitting.set(false);
        this.router.navigate(['/datos']);
      },
      error: (error) => {
        const message = extractHttpErrorMessage(error, 'No pudimos iniciar sesion. Intentalo mas tarde.');
        this.serverError.set(message);
        toast.error(message);
        this.isSubmitting.set(false);
      },
    });
  }

  protected contactSupport(): void {
    if (typeof window !== 'undefined') {
      window.open('mailto:soporte@agropre.com?subject=Recuperar%20mi%20contrasena%20AgroPre', '_blank');
    }
  }
}
