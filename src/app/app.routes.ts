import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'meal',
    loadChildren: () => import('./meal/meal.module').then((m) => m.MealModule),
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then((m) => m.ChatModule),
    canActivate: [authGuard],
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
