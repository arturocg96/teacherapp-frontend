import { inject, Injectable } from '@angular/core';

import { UsuariosService } from './usuarios.service';
import { Iusuario } from '../interfaces/iusuario';

@Injectable({
  providedIn: 'root',
})
export class AdministradoresService {
  usuariosService = inject(UsuariosService);
  arrAdministradores!: Iusuario[];

  constructor() {
    this.arrAdministradores = this.usuariosService.arrUsuarios.filter(
      (usuario) => usuario.rol === 'administrador'
    );
  }
}
