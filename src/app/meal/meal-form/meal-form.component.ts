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
  meal$: Observable<any> = of({});

  constructor(
    private fb: FormBuilder,
    // private firestore: Firestore,
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
    this.mealId = this.route.snapshot.paramMap.get('id');
    if (this.mealId) {
      // const mealDoc = doc(this.firestore, `meals/${this.mealId}`);
      // this.meal$ = docData(mealDoc);
      // this.meal$.subscribe((meal) => {
      //   if (meal) {
      //     this.mealForm.patchValue(meal);
      //   }
      // });
    }
  }

  onSubmit(): void {
    if (this.mealForm.valid) {
      const newMeal: Meal = this.mealForm.value;
      this.mealService
        .addMeal(newMeal)
        .then(() => {
          this.router.navigate(['/meal/list']);
        })
        .catch((error) => {
          console.error('Error adding meal:', error);
        });
    }
  }
}
