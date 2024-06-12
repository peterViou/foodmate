import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MealEntryComponent } from './meal-entry/meal-entry.component';

const routes: Routes = [{ path: 'entry', component: MealEntryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MealRoutingModule {}
