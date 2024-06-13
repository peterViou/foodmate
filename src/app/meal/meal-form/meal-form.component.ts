import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
// import {
//   Firestore,
//   collection,
//   doc,
//   docData,
//   setDoc,
//   updateDoc,
// } from '@angular/fire/firestore';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Meal, MealService } from '../meal.service';

@Component({
  selector: 'app-meal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './meal-form.component.html',
  styleUrls: ['./meal-form.component.css'],
})
export class MealFormComponent implements OnInit {
  mealForm: FormGroup;
  mealId: string | null = null;
  isEditMode: boolean = false;
  // meal$: Observable<any> = of({});

  constructor(
    private fb: FormBuilder,
    private mealService: MealService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.mealForm = this.fb.group({
      mealName: ['', Validators.required],
      calories: ['', Validators.required],
      description: ['', Validators.required],
      ingredients: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.mealId = params.get('id');
      if (this.mealId) {
        this.isEditMode = true;
        this.getMeal(this.mealId);
      }
    });
  }

  getMeal(id: string): void {
    this.mealService.getMeal(id).subscribe((meal) => {
      if (meal) {
        this.mealForm.patchValue(meal);
      }
    });
  }

  onSubmit(): void {
    if (this.mealForm.valid) {
      const meal: Meal = this.mealForm.value;
      if (this.isEditMode && this.mealId) {
        this.mealService
          .updateMeal(this.mealId, meal)
          .then(() => {
            this.router.navigate(['/meal/list']);
          })
          .catch((error) => {
            console.error('Error updating meal:', error);
          });
      } else {
        this.mealService
          .addMeal(meal)
          .then(() => {
            this.router.navigate(['/meal/list']);
          })
          .catch((error) => {
            console.error('Error adding meal:', error);
          });
      }
    }
  }
}
