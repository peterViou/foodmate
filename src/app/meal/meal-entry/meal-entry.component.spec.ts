import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealEntryComponent } from './meal-entry.component';

describe('MealEntryComponent', () => {
  let component: MealEntryComponent;
  let fixture: ComponentFixture<MealEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
