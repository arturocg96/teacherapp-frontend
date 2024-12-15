import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import Swal from 'sweetalert2';

import { Iusuario } from '../../../interfaces/iusuario';
import { Iregistros } from '../../../interfaces/iregistros';
import { environment } from '../../../../environments/environments';
import { RegistrosService } from '../../../services/registros.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-students',
  templateUrl: './my-students.component.html',
  styleUrl: './my-students.component.css',
  standalone: true,
  imports: [DatePipe, CommonModule, ReactiveFormsModule, FormsModule],
})
export class MyStudentsComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  usuariosService = inject(UsuariosService);
  registrosService = inject(RegistrosService);

  API_URL = environment.API_URL;
  alumnos: Iregistros[] = []; // Aquí se almacenará la lista de alumnos filtrados
  filterForm: FormGroup; // Formulario para filtros de estado y fecha
  usuario!: Iusuario;

  constructor() {
    this.filterForm = this.fb.group({
      estado: [''], // Filtro por estado
      fecha: [''], // Filtro por fecha de inscripción
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      this.usuario = await this.usuariosService.getUsuarioActual();

      if (!this.usuario || this.usuario.rol !== 'profesor') {
        this.router.navigate(['/dashboard']);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron obtener los datos de usuario.',
      }).then(() => {
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      });
    }

    await this.iniciarlizarComponente();

    // Si necesitas aplicar algún filtro inicial, hazlo aquí
    // this.applyFilters();
  }

  async iniciarlizarComponente() {
    try {
      this.alumnos = await this.registrosService.getRegistrosDeUsuario(
        this.usuario
      );
    } catch (error) {
      console.error('Error al obtener alumnos:', error);
    }
  }

  applyFilters() {
    const { estado, fecha } = this.filterForm.value;
    // Lógica para aplicar filtros en la tabla de alumnos
  }

  toggleEstado(alumno: Iusuario) {
    alumno.activo = !alumno.activo;
  }

  // Método para validar el alumno (simulación)
  darDeBaja(idRegistro: number): void {
    console.log(`Alumno ${idRegistro} validado.`);
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción dará de baja al alumno del curso',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#cceabb',
      cancelButtonColor: '#fdcb9e',
      confirmButtonText: 'Sí, dar de baja',
      cancelButtonText: 'Cancelar',
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.registrosService.darDeBaja(idRegistro);
          Swal.fire(
            '¡Dado de baja!',
            'El alumno ha sido dado de baja exitosamente.',
            'success'
          );
          this.iniciarlizarComponente();
        }
      })
      .catch((error) => {
        console.error('Error al dar de baja el alumno:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo dar de baja el alumno.',
        });
      });
  }
}
