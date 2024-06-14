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

  setFormErrors(errorMsg: string) {
    if (errorMsg.includes('email')) {
      this.signupForm.controls['email'].setErrors({ serverError: errorMsg });
    } else if (errorMsg.includes('password')) {
      this.signupForm.controls['password'].setErrors({ serverError: errorMsg });
      this.signupForm.controls['confirmPassword'].setErrors({
        serverError: errorMsg,
      });
    } else {
      this.signupForm.setErrors({ serverError: errorMsg });
    }
  }

  isFieldInvalid(field: string): boolean {
    return (
      !this.signupForm.controls[field].valid &&
      (this.signupForm.controls[field].touched ||
        this.signupForm.controls[field].dirty)
    );
  }

  getErrorMessage(field: string): string {
    const control = this.signupForm.get(field);
    if (control?.hasError('required')) {
      return 'This field is required';
    } else if (control?.hasError('email')) {
      return 'Please enter a valid email';
    } else if (control?.hasError('serverError')) {
      return control.getError('serverError');
    }
    return '';
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
