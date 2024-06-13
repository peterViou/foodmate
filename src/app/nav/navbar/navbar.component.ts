import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Auth, user, signOut } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  user$: Observable<any>;
  dropdownOpen = false;

  constructor(private auth: Auth) {
    this.user$ = user(auth);
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {
    signOut(this.auth)
      .then(() => {
        console.log('User signed out');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  }
}
