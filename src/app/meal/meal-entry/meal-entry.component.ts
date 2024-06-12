import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Component({
  selector: 'app-meal-entry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './meal-entry.component.html',
  styleUrls: ['./meal-entry.component.css'],
})
export class MealEntryComponent {
  mealForm: FormGroup;
  private firestore = inject(Firestore);

  constructor(private fb: FormBuilder) {
    this.mealForm = this.fb.group({
      mealName: ['', [Validators.required]],
      calories: ['', [Validators.required, Validators.min(0)]],
      date: ['', Validators.required],
      description: ['', Validators.required],
      ingredients: ['', Validators.required],
    });
  }

  onSubmit(): void {
    console.log('Meal form submitted');
    if (this.mealForm.valid) {
      console.log('Form is valid');
      console.log('Meal Name:', this.mealForm.value.mealName);
      console.log('Calories:', this.mealForm.value.calories);
      console.log('Date:', this.mealForm.value.date);
      console.log('Description:', this.mealForm.value.description);
      console.log('Ingredients:', this.mealForm.value.ingredients);

      const mealData = this.mealForm.value;
      const mealsCollection = collection(this.firestore, 'meals');

      addDoc(mealsCollection, mealData)
        .then(() => {
          console.log('Meal entry successful');
        })
        .catch((error) => {
          console.error('Meal entry failed', error);
        });
    } else {
      console.log('Form is invalid');
    }
  }
}
