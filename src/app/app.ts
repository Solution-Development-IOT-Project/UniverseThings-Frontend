import { Component, signal, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { DarkModeService } from '@shared/services/darkMode.service';
import { ZardToastComponent } from '@shared/components/toast/toast.component';
import { NavbarComponent } from './public/components/navbar/navbar.component';
import { FooterComponent } from './public/components/footer/footer.component';
import { NgIf } from '@angular/common';
import { Subject, filter, takeUntil } from 'rxjs';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ZardToastComponent, NgIf],
  template: `
    <div class="font-inter">
      <div class="grid min-h-dvh grid-rows-[auto_1fr_auto]">
        <app-navbar *ngIf="showChrome()" />
        <div class="min-h-0">
          <router-outlet />
          <z-toaster />
        </div>
        <app-footer *ngIf="showChrome()" />
      </div>
    </div>
  `,
  styles: `
  `
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('agro-pre-frontend');
  protected readonly showChrome = signal(true);

  private readonly darkModeService = inject(DarkModeService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    //this.darkModeService.initTheme();
    this.updateChromeVisibility(this.router.url);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => this.updateChromeVisibility(event.urlAfterRedirects));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateChromeVisibility(url: string): void {
    const authRoutes = ['/login', '/register'];
    const hideChrome = authRoutes.some((route) => url.startsWith(route));
    this.showChrome.set(!hideChrome);
  }

}
