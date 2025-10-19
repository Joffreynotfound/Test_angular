import { Routes } from '@angular/router';
import { HouseComponent } from './house/house.component';

export const routes: Routes = [
  { path: '', redirectTo: 'house', pathMatch: 'full' },
  { path: 'house', component: HouseComponent },
];
