import { Routes } from '@angular/router';
import {NotFoundComponent} from './public/pages1/not-found/not-found.component';
import {AlertasComponent} from './public/pages1/Alerts/Alertas.component';
import {DatosComponent} from './public/pages1/Data/datos.component';

export const routes: Routes = [

  { path: 'alertas', component:AlertasComponent },
  { path: 'datos', component:DatosComponent },
// { path: 'datos', component: DatosComponent },
  {path: '**', component: NotFoundComponent},
];
