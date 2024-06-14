import { Component } from '@angular/core';

import { Observable, from } from 'rxjs';
import { User } from '@angular/fire/auth';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  user$: Observable<User | null>;
  dropdownOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.user$;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  login() {
    this.router.navigate(['/auth/login']);
  }

  logout() {
    this.authService
      .SignOut()
      .then(() => {
        console.log('User logged out');
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  }
}
