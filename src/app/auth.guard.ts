import { inject } from '@angular/core';
import { CanActivateFn, Router} from '@angular/router';
import {AuthenticationService} from "./core/services/authentication/authentication.service";


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);


  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
