import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  // Sign up with email and password
  SignUp(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  // Sign in with email and password
  SignIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut();
  }
}
