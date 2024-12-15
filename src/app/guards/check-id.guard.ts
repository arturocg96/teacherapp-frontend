import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../services/login.service';

export const checkIdGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  const id = route.params['id'];

  //sólo dejo cargar la página si el id es el del usuario logado
  //o si es usuario administrador
  if (loginService.getLoggedUserId() != Number(id) && loginService.getLoggedUserRole() != 'administrador') {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Usuario no válido',
      confirmButtonColor: '#d33',
    });
    router.navigateByUrl('/');
    return false;
  }
  return true;
};
