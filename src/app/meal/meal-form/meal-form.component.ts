import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
// import {
//   Firestore,
//   collection,
//   doc,
//   docData,
//   setDoc,
//   updateDoc,
// } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-meal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.mealForm = this.fb.group({
      mealName: [''],
      description: [''],
      ingredients: [''],
      calories: [''],
      date: [''],
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
    // if (this.mealForm.valid) {
    //   const mealData = this.mealForm.value;
    //   if (this.mealId) {
    //     const mealDocRef = doc(this.firestore, `meals/${this.mealId}`);
    //     updateDoc(mealDocRef, mealData).then(() => {
    //       this.router.navigate(['/meal/list']);
    //     });
    //   } else {
    //     const mealsCollectionRef = collection(this.firestore, 'meals');
    //     setDoc(doc(mealsCollectionRef), mealData).then(() => {
    //       this.router.navigate(['/meal/list']);
    //     });
    //   }
    // }
  }
}
