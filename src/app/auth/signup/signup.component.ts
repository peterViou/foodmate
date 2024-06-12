import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { inject } from '@angular/core';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm: FormGroup;
  private auth = inject(Auth);

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    console.log('Signup form submitted');
    if (this.signupForm.valid) {
      console.log('Form is valid');
      console.log('Email:', this.signupForm.value.email);
      console.log('Password:', this.signupForm.value.password);

      createUserWithEmailAndPassword(
        this.auth,
        this.signupForm.value.email,
        this.signupForm.value.password
      )
        .then(() => {
          console.log('Signup successful');
        })
        .catch((error) => {
          console.error('Signup failed', error);
          if (error.code === 'auth/email-already-in-use') {
            console.error('Email already in use');
          } else if (error.code === 'auth/invalid-email') {
            console.error('Invalid email');
          } else if (error.code === 'auth/weak-password') {
            console.error('Weak password');
          } else {
            console.error('Unknown error:', error.message);
          }
        });
    } else {
      console.log('Form is invalid');
    }
  }
}
