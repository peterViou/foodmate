import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
  onAuthStateChanged,
  signOut,
} from '@angular/fire/auth';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ErrorHandlerService } from '../shared/services/error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private errorHandler = inject(ErrorHandlerService);
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private router: Router) {
    // Écoutez les changements d'état d'authentification et mettez à jour le BehaviorSubject
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
  }

  SignIn(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password).then(
      () => {
        console.log('Login successful');
        this.router.navigate(['/chat']);
      },
      (error) => {
        const errorMessage = this.errorHandler.handleError(error);
        console.error('Login failed', errorMessage);
      }
    );
  }

  // TODO: Add user notifications for successful sign in, and create a user welcome page to invite te proceed a profile step by step
  // TODO: Ask the user to confirm their password (type it twice) to reduce the possibility of typos.
  // TODO: Remember to ask the user to agree to your terms and conditions
  // TODO : Don’t forget a password recovery/reset feature
  SignUp(email: string, password: string): Promise<void> {
    return createUserWithEmailAndPassword(this.auth, email, password).then(
      () => {
        console.log('Signup successful');
      },
      (error) => {
        const errorMessage = this.errorHandler.handleError(error);
        console.error('Signup failed', errorMessage);
      }
    );
  }
  // TODO: Add user notifications for successful sign out
  SignOut(): Promise<void> {
    return signOut(this.auth).then(
      () => {
        console.log('Signout successful');
        this.userSubject.next(null);
        this.router.navigate(['/']);
      },
      (error) => {
        const errorMessage = this.errorHandler.handleError(error);
        console.error('Signout failed', errorMessage);
      }
    );
  }

  getUser(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(
        this.auth,
        (user) => {
          if (user) {
            resolve(user);
          } else {
            resolve(null);
          }
        },
        (error) => {
          this.errorHandler.handleError(error);
          reject(error);
        }
      );
    });
  }
}
