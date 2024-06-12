import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MealEntryComponent } from './meal-entry/meal-entry.component';
import { MealListComponent } from './meal-list/meal-list.component';

const routes: Routes = [
  { path: 'entry', component: MealEntryComponent },
  { path: 'list', component: MealListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MealRoutingModule {}
