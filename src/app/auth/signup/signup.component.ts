import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    console.log('Signup form submitted');
    if (this.signupForm.valid) {
      console.log('Form is valid');
      console.log('Email:', this.signupForm.value.email);
      console.log('Password:', this.signupForm.value.password);

      this.authService
        .SignUp(this.signupForm.value.email, this.signupForm.value.password)
        .then(() => {
          console.log('Signup successful');
          console.log('Auto Login');
          this.authService
            .SignIn(this.signupForm.value.email, this.signupForm.value.password)
            .then(() => {
              this.router.navigate(['/meal/list']);
            })
            .catch((error) => console.error('Login failed', error));
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
