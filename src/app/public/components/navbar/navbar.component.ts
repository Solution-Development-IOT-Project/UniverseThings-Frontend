import { Component } from '@angular/core';
import {ZardMenuModule} from '@shared/components/menu/menu.module';
import {ZardButtonComponent} from '@shared/components/button/button.component';
import {Router} from '@angular/router';
import {AgropreLogoComponent} from '@shared/components/agropre-logo/agropre-logo.component';


@Component({
  selector: 'app-navbar',
  imports: [
    ZardMenuModule,
    ZardButtonComponent,
    AgropreLogoComponent
  ],
  template: `
    <header class="border-b">
      <div class="container mx-auto flex items-center h-18 justify-between px-4 sm:px-6 lg:px-8">

        <div class="flex items-center gap-16">
          <div class="flex items-center gap-3">
            <app-agropre-logo [size]="36"/>
            <h1 class="text-xl font-bold"> AgroPre </h1>
          </div>
          <nav>
            <div class="relative">
              <button z-button zType="ghost" class="text-muted-foreground" (click)="goToDashboard()">
                Dashboard
              </button>

              <button z-button zType="ghost" class="text-muted-foreground" (click)="goToProgress()">
                Progress
              </button>

              <button z-button zType="ghost" class="text-muted-foreground" (click)="goToAlerts()">
                Alertas
              </button>


            </div>
          </nav>
        </div>
      </div>
    </header>
  `,
  styles: ``
})
export class NavbarComponent {

  constructor(private router: Router) {
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToProgress() {
    this.router.navigate(['/progress/2d2631b8-0991-4934-a5a9-81c085d7f208']);
  }

  goToAlerts() {
    this.router.navigate(['/alertas']);
  }


}
