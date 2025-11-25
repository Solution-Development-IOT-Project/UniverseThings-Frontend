import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { toast } from 'ngx-sonner';

import { AgropreLogoComponent } from '@shared/components/agropre-logo/agropre-logo.component';
import { ZardFormModule } from '@shared/components/form/form.module';
import { ZardInputDirective } from '@shared/components/input/input.directive';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardIconComponent } from '@shared/components/icon/icon.component';
import { AuthService, RegisterRequest } from '@shared/services/auth.service';
import { extractHttpErrorMessage } from '@shared/utils/http-error.util';

type RegisterFormModel = {
  fullName: string;
  email: string;
  roleId: number;
  password: string;
  confirmPassword: string;
  acceptPolicies: boolean;
};

@Component({
  selector: 'app-register',
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
    <section class="relative min-h-dvh overflow-hidden bg-gradient-to-br from-white via-emerald-50 to-sky-50 px-4 py-12 font-inter text-slate-900">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute -top-12 right-6 h-80 w-80 rounded-full bg-sky-200/60 blur-[150px]"></div>
        <div class="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/25 blur-[160px]"></div>
        <div class="absolute inset-6 rounded-[44px] border border-white/70"></div>
      </div>

      <div class="relative mx-auto grid max-w-6xl gap-8 rounded-[44px] border border-white/60 bg-white/70 p-6 shadow-2xl shadow-emerald-100/40 backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
        <div class="space-y-10">
          <div class="flex flex-wrap items-center gap-4">
            <div class="rounded-3xl bg-primary/10 p-4 ring-1 ring-primary/20">
              <app-agropre-logo [size]="56" className="drop-shadow" />
            </div>
            <div>
              <p class="text-4xl font-semibold">AgroPre</p>
              <p class="text-xs font-semibold uppercase tracking-[0.5em] text-muted-foreground">UniverseThing</p>
            </div>
            <span class="rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">Activa tu cuenta</span>
          </div>

          <div class="space-y-4">
            <p class="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Plataforma IoT Agricola</p>
            <h1 class="text-4xl font-semibold leading-tight sm:text-5xl">
              Conecta tus cultivos a la nube y recibe recomendaciones con IA
            </h1>
            <p class="text-base text-muted-foreground">
              Registra tu equipo para monitorear lotes, vincular sensores y automatizar alertas de riego, clima y sanidad.
            </p>
          </div>

          <div class="space-y-5 rounded-[32px] border border-primary/20 bg-gradient-to-br from-primary/5 to-white p-6 shadow-lg shadow-primary/10">
            <p class="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Tu hoja de inicio</p>
            <div class="space-y-6">
              <div *ngFor="let step of onboardingSteps; let index = index" class="flex items-start gap-4">
                <div class="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-3xl bg-primary text-white shadow-lg shadow-primary/30">
                  <span class="text-lg font-semibold">{{ index + 1 }}</span>
                  <span class="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary shadow-lg shadow-primary/40">
                    <z-icon [zType]="step.icon" zSize="sm"></z-icon>
                  </span>
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-semibold uppercase tracking-wide text-primary/80">{{ step.label }}</p>
                  <p class="text-lg font-semibold">{{ step.title }}</p>
                  <p class="text-sm text-muted-foreground">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div class="relative">
          <div class="pointer-events-none absolute -left-6 top-0 hidden h-32 w-32 rounded-full bg-primary/20 blur-3xl md:block"></div>
          <div class="relative rounded-[32px] border border-primary/15 bg-white/95 p-8 shadow-2xl shadow-primary/25 backdrop-blur">
            <div class="flex flex-wrap gap-3 text-sm font-medium">
              <a routerLink="/login" class="rounded-full px-4 py-1 text-muted-foreground transition hover:text-primary">Iniciar sesion</a>
              <span class="rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-primary shadow-sm">Registrarse</span>
            </div>

            <div class="mt-8 space-y-2">
              <p class="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Crear cuenta</p>
              <h2 class="text-3xl font-bold">Completa los datos para unirte</h2>
              <p class="text-sm text-muted-foreground">Tu perfil habilita accesos a tableros, sensores y alertas inteligentes.</p>
            </div>

            <form class="mt-8 space-y-6" [formGroup]="registerForm" (ngSubmit)="submit()">
              <z-form-field>
                <z-form-label zRequired="true">Nombre completo</z-form-label>
                <z-form-control [errorMessage]="controlInvalid('fullName') ? controlError('fullName') : ''">
                  <input
                    z-input
                    formControlName="fullName"
                    type="text"
                    placeholder="Andrea Torres"
                    autocomplete="name"
                    [zStatus]="controlInvalid('fullName') ? 'error' : undefined" />
                </z-form-control>
              </z-form-field>

              <z-form-field>
                <z-form-label zRequired="true">Correo electronico</z-form-label>
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
                <z-form-label zRequired="true">Rol dentro de AgroPre</z-form-label>
                <z-form-control [errorMessage]="controlInvalid('roleId') ? controlError('roleId') : ''" helpText="Selecciona el perfil que mejor describa tu actividad.">
                  <select
                    class="h-11 w-full rounded-xl border border-input bg-white px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    formControlName="roleId">
                    <option *ngFor="let role of roles" [value]="role.value">
                      {{ role.label }}
                    </option>
                  </select>
                </z-form-control>
              </z-form-field>

              <div class="grid gap-6 md:grid-cols-2">
                <z-form-field>
                  <z-form-label zRequired="true">Contrasena</z-form-label>
                  <z-form-control [errorMessage]="controlInvalid('password') ? controlError('password') : ''">
                    <input
                      z-input
                      formControlName="password"
                      type="password"
                      placeholder="Crea una contrasena segura"
                      autocomplete="new-password"
                      [zStatus]="controlInvalid('password') ? 'error' : undefined" />
                  </z-form-control>
                </z-form-field>

                <z-form-field>
                  <z-form-label zRequired="true">Confirmar contrasena</z-form-label>
                  <z-form-control [errorMessage]="controlError('confirmPassword')">
                    <input
                      z-input
                      formControlName="confirmPassword"
                      type="password"
                      placeholder="Repite tu contrasena"
                      autocomplete="new-password"
                      [zStatus]="shouldShowMismatchError() ? 'error' : undefined" />
                  </z-form-control>
                </z-form-field>
              </div>

              <div class="rounded-2xl border border-input/40 bg-muted/60 p-4">
                <label class="flex items-start gap-3 text-sm text-muted-foreground">
                  <input type="checkbox" class="mt-1 size-4 rounded border-border text-primary focus:ring-primary" formControlName="acceptPolicies" />
                  <span>Acepto la politica de datos y autorizo comunicaciones de AgroPre sobre UniverseThing.</span>
                </label>
                @if (controlInvalid('acceptPolicies')) {
                  <p class="mt-2 text-sm text-destructive">{{ controlError('acceptPolicies') }}</p>
                }
              </div>

              @if (serverError()) {
                <div class="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {{ serverError() }}
                </div>
              }

              <button
                z-button
                zType="default"
                zFull="true"
                type="submit"
                [disabled]="isSubmitting()"
                [zLoading]="isSubmitting()">
                Crear cuenta
              </button>
            </form>

            <p class="mt-6 text-center text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?
              <a routerLink="/login" class="font-semibold text-primary hover:underline">Inicia sesion aqui</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly registerForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    roleId: [2, [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    acceptPolicies: [false, [Validators.requiredTrue]],
  });

  protected readonly roles = [
    { label: 'Administrador de finca', value: 1 },
    { label: 'Productor o agronomo', value: 2 },
    { label: 'Equipo de monitoreo', value: 3 },
  ] as const;

  protected readonly onboardingSteps = [
    {
      label: 'Configura',
      title: 'Registra tus lotes y cultivos',
      description: 'Mapea hectareas, cultivos y ciclos para empezar a medir.',
      icon: 'layers',
    },
    {
      label: 'Conecta',
      title: 'Sincroniza sensores y gateways',
      description: 'Integra humedad, clima y drones en una sola consola.',
      icon: 'monitor',
    },
    {
      label: 'Protege',
      title: 'Activa alertas inteligentes',
      description: 'Recibe avisos predictivos y protocolos automatizados.',
      icon: 'shield',
    },
  ] as const;

  protected readonly isSubmitting = signal(false);
  protected readonly serverError = signal<string | null>(null);
  private readonly mismatchWarning = signal(false);

  protected controlInvalid(controlName: keyof RegisterFormModel): boolean {
    const control = this.registerForm.controls[controlName];
    if (controlName === 'confirmPassword') {
      return (
        (control.invalid && (control.dirty || control.touched)) ||
        this.shouldShowMismatchError()
      );
    }
    return control.invalid && (control.dirty || control.touched);
  }

  protected controlError(controlName: keyof RegisterFormModel): string {
    const control = this.registerForm.controls[controlName];
    switch (controlName) {
      case 'fullName':
        if (control.errors?.['required']) return 'Tu nombre completo es obligatorio.';
        if (control.errors?.['minlength']) return 'Ingresa al menos 3 caracteres.';
        return '';
      case 'email':
        if (control.errors?.['required']) return 'El correo es obligatorio.';
        if (control.errors?.['email']) return 'Ingresa un correo valido.';
        return '';
      case 'roleId':
        if (control.errors?.['required']) return 'Selecciona un rol para continuar.';
        return '';
      case 'password':
        if (control.errors?.['required']) return 'La contrasena es obligatoria.';
        if (control.errors?.['minlength']) return 'Debe tener al menos 6 caracteres.';
        return '';
      case 'confirmPassword':
        if (control.errors?.['required']) return 'Confirma tu contrasena.';
        if (this.shouldShowMismatchError()) return 'Las contrasenas no coinciden.';
        return '';
      case 'acceptPolicies':
        if (control.errors?.['requiredTrue']) return 'Debes aceptar las politicas para continuar.';
        return '';
      default:
        return '';
    }
  }

  protected shouldShowMismatchError(): boolean {
    const control = this.registerForm.controls.confirmPassword;
    return (
      this.passwordsMismatch() &&
      (control.dirty || control.touched || this.mismatchWarning())
    );
  }

  protected submit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.mismatchWarning.set(false);

    if (this.passwordsMismatch()) {
      this.mismatchWarning.set(true);
      this.registerForm.controls.confirmPassword.markAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.serverError.set(null);

    const { fullName, email, roleId, password } = this.registerForm.getRawValue();

    const payload: RegisterRequest = {
      full_name: fullName.trim(),
      email: email.trim(),
      password,
      role_id: roleId,
      is_active: true,
    };

    this.authService.register(payload).subscribe({
      next: () => {
        toast.success('Cuenta creada con exito. Ahora puedes iniciar sesion.');
        this.isSubmitting.set(false);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        const message = extractHttpErrorMessage(error, 'No pudimos completar el registro. Intentalo mas tarde.');
        this.serverError.set(message);
        toast.error(message);
        this.isSubmitting.set(false);
      },
    });
  }

  private passwordsMismatch(): boolean {
    const password = this.registerForm.controls.password.value;
    const confirmPassword = this.registerForm.controls.confirmPassword.value;
    return password !== confirmPassword;
  }
}
