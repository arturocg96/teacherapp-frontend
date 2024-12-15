import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import Swal from 'sweetalert2';

export const checkAdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  if (loginService.getLoggedUserRole() != 'administrador') {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Acceso no permitido',
      confirmButtonColor: '#d33',
    });
    router.navigateByUrl('/');
    return false;
  }
  return true;
};
