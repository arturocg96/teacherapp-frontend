import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { Iusuario } from '../../../interfaces/iusuario';
import { UsuariosService } from '../../../services/usuarios.service';
import { ProfesoresService } from '../../../services/profesores.service';

@Component({
  selector: 'app-my-info',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './my-info.component.html',
  styleUrl: './my-info.component.css',
})
export class MyInfoComponent {
  usuariosService = inject(UsuariosService);
  profesoresService = inject(ProfesoresService);

  usuario!: Iusuario;
  profesor!: any;
  sobre_mi: string = '';

  async ngOnInit(): Promise<void> {
    try {
      this.usuario = await this.usuariosService.getUsuarioActual();

      if (this.usuario.id) {
        const respuesta: any = await this.profesoresService.getProfesorById(
          this.usuario.id
        );

        this.profesor = respuesta.profesor;
        this.sobre_mi = this.profesor.sobre_mi;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async actualizarSobreMi(id: number, sobre_mi: string) {
    try {
      const respuesta = await this.profesoresService.actualizarSobreMi(
        +id,
        sobre_mi
      );
      this.profesor = respuesta;
      this.sobre_mi = this.profesor.sobre_mi;
      Swal.fire({
        icon: 'success',
        title: '"Sobre mi" actualizado',
        text: 'Se actualizó la información del apartado "Sobre mi"',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar la información "sobre mi"',
      });
    }
  }
}
