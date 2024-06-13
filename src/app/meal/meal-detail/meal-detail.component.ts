import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { MealService, Meal } from '../meal.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-meal-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './meal-detail.component.html',
  styleUrls: ['./meal-detail.component.css'],
})
export class MealDetailComponent implements OnInit {
  meal$!: Observable<Meal | undefined>;
  mealId!: string;

  constructor(
    private mealService: MealService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.mealId = params.get('id') || '';
      if (this.mealId) {
        this.meal$ = this.mealService.getMeal(this.mealId);
      }
    });
  }

  deleteMeal(): void {
    if (this.mealId) {
      this.mealService
        .deleteMeal(this.mealId)
        .then(() => {
          this.router.navigate(['/meal/list']);
        })
        .catch((error) => {
          console.error('Error deleting meal:', error);
        });
    }
  }
}
