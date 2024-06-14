import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    map((user) => {
      if (user) {
        console.log('User is logged in:', user);
        return true;
      } else {
        console.log('User is not logged in, redirecting to login page');
        router.navigate(['/auth/login']);
        return false;
      }
    })
  );
};
