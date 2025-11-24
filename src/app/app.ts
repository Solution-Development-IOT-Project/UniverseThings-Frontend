import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { inject } from '@angular/core';
import { DarkModeService } from '@shared/services/darkMode.service';
import {ZardToastComponent} from '@shared/components/toast/toast.component';
import {NavbarComponent} from './public/components/navbar/navbar.component';
import {FooterComponent} from './public/components/footer/footer.component';
import { StateCountPipe } from '@shared/pipes/state-count.pipe';
import { NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ZardToastComponent,StateCountPipe],
  template: `
     <div class="font-inter ">

        <div class="grid min-h-dvh grid-rows-[auto_1fr_auto]">
          <app-navbar/>
          <div class="">
            <router-outlet  />
            <z-toaster />
          </div>
          <app-footer/>
        </div>

    </div>
  `,
  styles: `
  `
})
export class App implements OnInit{
  protected readonly title = signal('agro-pre-frontend');

  private readonly darkModeService = inject(DarkModeService);
  //protected readonly authService = inject(AuthService);

  ngOnInit(): void {
    //this.darkModeService.initTheme();
  }

}
