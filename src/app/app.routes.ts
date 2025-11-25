import { Routes } from '@angular/router';
import { NotFoundComponent } from './public/pages1/not-found/not-found.component';
import { AlertasComponent } from './public/pages1/Alerts/Alertas.component';
import { DatosComponent } from './public/pages1/Data/datos.component';
import { LoginComponent } from './public/pages1/auth/login/login.component';
import { RegisterComponent } from './public/pages1/auth/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'alertas', component: AlertasComponent },
  { path: 'datos', component: DatosComponent },
  { path: '**', component: NotFoundComponent },
];
