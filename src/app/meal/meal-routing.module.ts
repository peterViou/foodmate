import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MealListComponent } from './meal-list/meal-list.component';
import { MealDetailComponent } from './meal-detail/meal-detail.component';
import { MealFormComponent } from './meal-form/meal-form.component';
import { authGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: 'list', component: MealListComponent, canActivate: [authGuard] },
  {
    path: 'detail/:id',
    component: MealDetailComponent,
    canActivate: [authGuard],
  },
  { path: 'add', component: MealFormComponent, canActivate: [authGuard] },
  { path: 'edit/:id', component: MealFormComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: '**', redirectTo: 'list' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MealRoutingModule {}
