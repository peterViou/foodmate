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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
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
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Login failed', error);
      }
    );
  }

  SignUp(email: string, password: string): Promise<void> {
    return createUserWithEmailAndPassword(this.auth, email, password).then(
      () => {
        console.log('Signup successful');
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Signup failed', error);
      }
    );
  }

  SignOut(): Promise<void> {
    return signOut(this.auth).then(
      () => {
        console.log('Signout successful');
        this.userSubject.next(null);
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Signout failed', error);
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
        reject
      );
    });
  }
}
