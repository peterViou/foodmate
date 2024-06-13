import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { MealService, Meal } from '../meal.service';

@Component({
  selector: 'app-meal-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './meal-detail.component.html',
  styleUrls: ['./meal-detail.component.css'],
})
export class MealDetailComponent implements OnInit {
  mealId!: string;
  meal$!: Observable<Meal | undefined>;

  constructor(
    private mealService: MealService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.mealId = params.get('id')!;
      this.meal$ = this.mealService.getMeal(this.mealId);
    });
  }
}
