import { Routes } from '@angular/router';
import {NotFoundComponent} from './public/pages/not-found/not-found.component';

export const routes: Routes = [

  {path: '**', component: NotFoundComponent},
];
