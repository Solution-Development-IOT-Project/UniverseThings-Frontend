import { Routes } from '@angular/router';
import {NotFoundComponent} from './public/pages1/not-found/not-found.component';
import {AlertasComponent} from './public/pages1/Alerts/Alertas.component';


export const routes: Routes = [

  { path: 'alertas', component:AlertasComponent },
// { path: 'datos', component: DatosComponent },
  {path: '**', component: NotFoundComponent},
];
