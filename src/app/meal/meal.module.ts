import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MealRoutingModule } from './meal-routing.module';
import { MealListComponent } from './meal-list/meal-list.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, MealRoutingModule, MealListComponent],
})
export class MealModule {}
