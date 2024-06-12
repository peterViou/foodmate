import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  constructor(private firestore: AngularFirestore) {}

  // Add a new meal
  addMeal(meal: any) {
    return this.firestore.collection('meals').add(meal);
  }

  // Get all meals
  getMeals(): Observable<any[]> {
    return this.firestore.collection('meals').valueChanges();
  }
}
