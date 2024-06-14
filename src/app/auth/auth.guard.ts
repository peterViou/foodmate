// Checklist for Route Protection Testing
// Ensure to test these routes both when logged in and logged out:

// 1. Meal List (Accessible only when logged in)
// URL: http://localhost:4200/meal/list

// 2. Meal Edit (Accessible only when logged in)
// URL: http://localhost:4200/meal/edit/F9JfDV0CvSHTFWw7xfwV

// 3. Meal Add (Accessible only when logged in)
// URL: http://localhost:4200/meal/add

// 4. Chat (Accessible only when logged in)
// URL: http://localhost:4200/chat

// 5. Meal Detail (Accessible only when logged in)
// URL: http://localhost:4200/meal/detail/HhZyk0GJd2v2KUuwSQdw

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
