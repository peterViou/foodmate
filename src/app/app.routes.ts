import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'meal',
    loadChildren: () => import('./meal/meal.module').then((m) => m.MealModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    redirectTo: '/meal/list',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/meal/list',
  },
];
