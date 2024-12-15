import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  if (loginService.isLogged()) {
    router.navigateByUrl('/');
    return false;
   }
  return true;
};
