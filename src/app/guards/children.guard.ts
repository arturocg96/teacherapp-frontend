import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import Swal from 'sweetalert2';

export const childrenGuard: CanActivateChildFn = (childRoute, state) => {
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
