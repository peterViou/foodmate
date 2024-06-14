import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { MealService, Meal } from '../meal.service';
import { MealListItemComponent } from './meal-list-item/meal-list-item.component';

@Component({
  selector: 'app-meal-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MealListItemComponent],
  templateUrl: './meal-list.component.html',
  styleUrls: ['./meal-list.component.css'],
})
export class MealListComponent implements OnInit {
  meals$: Observable<Meal[]> | undefined;

  constructor(private mealService: MealService) {}

  ngOnInit(): void {
    this.meals$ = this.mealService.getMeals();
  }

  deleteMeal(mealId: string): void {
    this.mealService
      .deleteMeal(mealId)
      .then(() => {
        console.log('Meal deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting meal:', error);
      });
  }
}
