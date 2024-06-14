import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Meal } from '../../meal.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-meal-list-item',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './meal-list-item.component.html',
  styleUrl: './meal-list-item.component.css',
})
export class MealListItemComponent {
  @Input() meal!: Meal;
  @Output() delete = new EventEmitter<string>();

  onDeleteMeal(): void {
    if (this.meal.id) {
      this.delete.emit(this.meal.id);
    }
  }
}
