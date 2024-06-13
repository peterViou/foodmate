import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-meal-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './meal-detail.component.html',
  styleUrls: ['./meal-detail.component.css'],
})
export class MealDetailComponent implements OnInit {
  mealId: string = ''; // Initialisation avec une chaîne vide
  meal$: Observable<any> = of({}); // Initialisation avec une valeur par défaut

  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mealId = id;
      const mealDoc = doc(this.firestore, `meals/${this.mealId}`);
      this.meal$ = docData(mealDoc);
    } else {
      // Gérer le cas où l'id est null
      console.error('No meal ID found in the route parameters.');
    }
  }
}
