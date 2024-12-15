import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

import { environment } from '../../../../environments/environments';
import { Iusuario } from '../../../interfaces/iusuario';
import { LoginService } from '../../../services/login.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { RegistrosService } from '../../../services/registros.service';
import { Iregistros } from '../../../interfaces/iregistros';

@Component({
  selector: 'app-my-classes',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './my-classes.component.html',
  styleUrl: './my-classes.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class MyClassesComponent {
  loginService = inject(LoginService);
  usuarioService = inject(UsuariosService);
  registrosService = inject(RegistrosService);

  API_URL = environment.API_URL;
  usuario!: Iusuario;
  registrosUsuario!: Iregistros[];

  async ngOnInit() {
    await this.iniciarComponente();
  }

  async iniciarComponente() {
    try {
      this.usuario = await this.usuarioService.getUsuarioActual();
      this.registrosUsuario = await this.registrosService.getRegistrosDeUsuario(
        this.usuario
      );
    } catch (error) {
      console.error('Error al obtener el usuario actual:', error);
    }
  }

  async darRegistroDeBaja(idRegistro: number) {
    try {
      await this.registrosService.darDeBaja(idRegistro);
      this.registrosUsuario = await this.registrosService.getRegistrosDeUsuario(
        this.usuario
      );
      Swal.fire({
        icon: 'success',
        title: 'Baja registrada',
        text: `Se ha registrado la baja de la inscripción con este profesor.`,
      });
      this.iniciarComponente();
    } catch (error) {
      console.error('Error al dar de baja el registro:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo tramitar la baja de la inscripción.',
      });
    }
  }
}
