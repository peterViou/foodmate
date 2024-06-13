import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MealListComponent } from './meal-list/meal-list.component';
import { MealDetailComponent } from './meal-detail/meal-detail.component';
import { MealFormComponent } from './meal-form/meal-form.component';

const routes: Routes = [
  { path: 'list', component: MealListComponent },
  { path: 'detail/:id', component: MealDetailComponent },
  { path: 'add', component: MealFormComponent },
  { path: 'edit/:id', component: MealFormComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: '**', redirectTo: 'list' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MealRoutingModule {}
