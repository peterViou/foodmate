import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);

  SignIn(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password).then(
      () => {
        console.log('Login successful');
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
      },
      (error) => {
        console.error('Signup failed', error);
      }
    );
  }
}
