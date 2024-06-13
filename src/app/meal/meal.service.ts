import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  collectionData,
  docData,
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Meal {
  id?: string;
  mealName: string;
  calories: number;
  description: string;
  ingredients: string;
  date: string;
}

@Injectable({
  providedIn: 'root',
})
export class MealService {
  constructor(private firestore: Firestore) {}

  // Add a new meal
  addMeal(meal: Meal): Promise<void> {
    const mealsCollection = collection(this.firestore, 'meals');
    return addDoc(mealsCollection, meal).then(() => {});
  }

  // Get all meals
  getMeals(): Observable<Meal[]> {
    const mealsCollection = collection(this.firestore, 'meals');
    return collectionData(mealsCollection, { idField: 'id' }) as Observable<
      Meal[]
    >;
  }

  // Get a single meal by ID
  getMeal(id: string): Observable<Meal | undefined> {
    const mealDocRef = doc(this.firestore, `meals/${id}`);
    return docData(mealDocRef, { idField: 'id' }) as Observable<
      Meal | undefined
    >;
  }

  // Update a meal by ID
  updateMeal(id: string, meal: Meal): Promise<void> {
    const mealDocRef = doc(this.firestore, `meals/${id}`);
    return updateDoc(mealDocRef, { ...meal });
  }

  // Delete a meal by ID
  deleteMeal(id: string): Promise<void> {
    const mealDocRef = doc(this.firestore, `meals/${id}`);
    return deleteDoc(mealDocRef);
  }
}
