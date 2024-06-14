import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private errorHandler: ErrorHandlerService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService
        .SignIn(this.loginForm.value.email, this.loginForm.value.password)
        .then(() => {
          this.router.navigate(['/meal/list']);
        })
        .catch((error) => {
          this.setFormErrors(error);
        });
    }
  }

  setFormErrors(errorMsg: string) {
    if (errorMsg.includes('email')) {
      this.loginForm.controls['email'].setErrors({ serverError: errorMsg });
    } else if (errorMsg.includes('password')) {
      this.loginForm.controls['password'].setErrors({ serverError: errorMsg });
    } else {
      // General error if it's not specific to email or password
      this.loginForm.setErrors({ serverError: errorMsg });
    }
  }

  isFieldInvalid(field: string): boolean {
    return (
      !this.loginForm.controls[field].valid &&
      (this.loginForm.controls[field].touched ||
        this.loginForm.controls[field].dirty)
    );
  }

  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (control?.hasError('required')) {
      return 'This field is required';
    } else if (control?.hasError('email')) {
      return 'Please enter a valid email';
    } else if (control?.hasError('serverError')) {
      return control.getError('serverError');
    }
    return '';
  }
}
