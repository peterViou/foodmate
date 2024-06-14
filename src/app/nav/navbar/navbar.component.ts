import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../shared/services/chat.service';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private firestoreService: ChatService
  ) {
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

  deleteChatHistory() {
    this.firestoreService.deleteAllMessages().then(() => {
      console.log('Chat history deleted');
      this.router.navigate(['/chat']);
    });
  }
}
