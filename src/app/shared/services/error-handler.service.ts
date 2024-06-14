import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor() {}

  handleError(error: any): string {
    let errorMessage = 'An unknown error occurred!';

    if (error instanceof HttpErrorResponse) {
      // Server-side error
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    } else if (error.code) {
      // Firebase or other service-specific error
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Sorry, please type a valid login email.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'User not found. Please sign up.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        default:
          errorMessage = `Error: ${error.message}`;
          break;
      }
    } else {
      errorMessage = error.message ? error.message : errorMessage;
    }

    return errorMessage;
  }
}
