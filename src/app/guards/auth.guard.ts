import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if (!localStorage.getItem('token')) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Debes estar autenticado',
      confirmButtonColor: '#d33',
    });
    router.navigateByUrl('/login');
    return false;
  }
  return true;
};
