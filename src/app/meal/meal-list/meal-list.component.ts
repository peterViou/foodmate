import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-meal-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meal-list.component.html',
  styleUrls: ['./meal-list.component.css'],
})
export class MealListComponent implements OnInit {
  meals$: Observable<any[]>;

  constructor(private firestore: Firestore) {
    const mealsCollection = collection(this.firestore, 'meals');
    this.meals$ = collectionData(mealsCollection);
  }

  ngOnInit(): void {}
}
