import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import Swal from 'sweetalert2';

import { Iopinion } from '../../../interfaces/iopinion';
import { Iregistros } from '../../../interfaces/iregistros';
import { Iusuario } from '../../../interfaces/iusuario';
import { OpinionesService } from '../../../services/opiniones.service';
import { RegistrosService } from '../../../services/registros.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { StarRatingComponent } from '../../../pages/dashboard/reviews/star-rating/star-rating.component';

type IprofesorOpinable = {
  id: number;
  nombre: string;
  apellidos: string;
};

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    ReactiveFormsModule,
    StarRatingComponent,
  ],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css'],
})
export class ReviewsComponent implements OnInit {
  // Inyección de dependencias
  router = inject(Router);
  usuariosService = inject(UsuariosService);
  opinionesService = inject(OpinionesService);
  registrosService = inject(RegistrosService);
  fb = inject(FormBuilder);

  // Variables
  usuario!: Iusuario;
  opiniones: Iopinion[] = [];
  opinionesFiltradas: Iopinion[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  filtroTiempo: string = '12m';
  mostrarModal: boolean = false;
  opinionForm: FormGroup;
  registros: Iregistros[] = [];
  alumnosRegistrados: Iusuario[] = [];
  profesoresOpinables!: any;
  opinionModalMode: 'add' | 'edit' = 'add';

  constructor() {
    this.opinionForm = this.fb.group({
      // Inicializar el formulario
      // estudiante_id: [0],
      profesor_id: [0],
      comentario: [''],
      puntuacion: [3], // Valor por defecto
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      this.iniciarlizarComponente();
    } catch (error) {
      console.error('Error al iniciar el componente:', error);
      this.router.navigate(['/dashboard']);
    }
  }

  async iniciarlizarComponente() {
    // Obtener el usuario actual
    this.usuario = await this.usuariosService.getUsuarioActual();

    // Obtener las opiniones/reseñas del usuario actual
    this.opiniones = await this.opinionesService.getOpinionesByUser(
      this.usuario
    );

    // Obtener los registros del usuario actual
    this.registros = await this.getRegistrosUsuario(this.usuario);

    // Componer un array de objeto profesores a partir de los registros del usuario
    this.profesoresOpinables = this.obtenerListadoDeProfesoresOpinables(
      this.registros
    );

    // Filtrar los profesores que ya tienen opinión/reseña
    this.profesoresOpinables = this.filtrarListadoProfesoresOpinables(
      this.profesoresOpinables,
      this.opiniones
    );

    // Inicializar filtro general de reseñas
    this.filtrarOpiniones();
  }

  getNombreProfesor(profesorId: number): string {
    const profesor = this.registros.find((r) => r.profesor_id === profesorId);
    return profesor
      ? `${profesor.nombre_profesor} ${profesor.apellidos_profesor}`
      : 'Profesor desconocido';
  }

  getNombreAlumno(alumnoId: number): string {
    const alumno = this.registros.find((r) => r.alumno_id === alumnoId);
    return alumno
      ? `${alumno.nombre_alumno} ${alumno.apellidos_alumno}`
      : 'Profesor desconocido';
  }

  getNombreMateria(estudianteId: number, profesorId: number): string {
    // const materia = MATERIAS.find((materia) => materia.id === materiaId);
    return 'Materia desconocida';
  }

  async getRegistrosUsuario(usuario: Iusuario): Promise<Iregistros[]> {
    let registros: Iregistros[] = [];
    try {
      const data = await this.registrosService.getRegistrosDeUsuario(usuario);
      registros = data;
    } catch (error) {
      console.error('Error al obtener registros:', error);
    }
    return registros;
  }

  filtrarOpiniones(): void {
    this.opinionesFiltradas = this.opiniones.slice(0, this.itemsPerPage);
    this.totalItems = this.opiniones.length;
  }

  agregarResena(): void {
    console.log('Agregar resena');
    if (this.profesoresOpinables.length == 0) {
      Swal.fire(
        'No puedes agregar reseñas',
        'Ya has opinado sobre todos los profesores con los que tienes registros. 😅 Edita alguna de tus reseñas publicadas o inscríbete con algún otro profesor.',
        'warning'
      );
      return;
    }
    this.mostrarModal = true;
    this.opinionForm.reset();
    this.opinionForm.get('estudiante_id')?.setValue(this.usuario.id);
  }

  editarResena(opinion: Iopinion): void {
    try {
      this.opinionModalMode = 'edit';
      this.opinionForm.reset();
      this.opinionForm.get('estudiante_id')?.setValue(this.usuario.id);
      this.opinionForm.get('profesor_id')?.setValue(opinion.profesor_id);
      this.opinionForm.get('comentario')?.setValue(opinion.comentario);
      this.opinionForm.get('puntuacion')?.setValue(opinion.puntuacion);
      this.mostrarModal = true;
    } catch (error) {
      this.opinionModalMode = 'add';
      this.mostrarModal = true;
      Swal.fire(
        'Error al editar opinión',
        'Ha ocurrido un error al editar la opinión',
        'error'
      );
    }
  }

  obtenerListadoDeProfesoresOpinables(
    registros: Iregistros[]
  ): IprofesorOpinable[] {
    if (registros.length > 0 && registros[0].profesor_id) {
      const profesoresMap = new Map();
      registros.forEach((item) => {
        profesoresMap.set(item.profesor_id, {
          id: item.profesor_id,
          nombre: item.nombre_profesor,
          apellidos: item.apellidos_profesor,
        });
      });
      return Array.from(profesoresMap.values());
    }
    return [];
  }

  filtrarListadoProfesoresOpinables(
    profesores: IprofesorOpinable[],
    opiniones: Iopinion[]
  ): IprofesorOpinable[] {
    let profesoresFiltrados: IprofesorOpinable[] = [];

    profesores.forEach((profesor: IprofesorOpinable) => {
      if (!opiniones.some((opinion) => opinion.profesor_id === profesor.id)) {
        profesoresFiltrados.push(profesor);
      }
    });

    return profesoresFiltrados;
  }

  async onSubmitAgregar(): Promise<void> {
    let opinion = this.opinionForm.value;
    opinion.profesor_id = +opinion.profesor_id;
    try {
      const [respuesta] = await this.opinionesService.addOpinion(opinion);
      this.opiniones.push(respuesta);
      this.filtrarOpiniones();
      Swal.fire(
        'Opinión agregada',
        'La opinión ha sido agregada exitosamente',
        'success'
      );
    } catch (error) {
      console.error('Error al agregar opinión:', error);
      Swal.fire(
        'Error al agregar opinión',
        'Ha ocurrido un error al agregar la opinión',
        'error'
      );
    }
    this.mostrarModal = false;
  }

  async onSubmitEditar(): Promise<void> {
    let opinion = this.opinionForm.value;
    opinion.profesor_id = +opinion.profesor_id;
    opinion.estudiante_id = this.usuario.id;
    try {
      const [respuesta] = await this.opinionesService.updateOpinion(opinion);
      this.iniciarlizarComponente();
      this.filtrarOpiniones();
      Swal.fire(
        'Opinión actualizada',
        'La opinión ha sido editada exitosamente',
        'success'
      );
    } catch (error) {
      console.error('Error al editar la opinión:', error);
      Swal.fire(
        'Error al editar la opinión',
        'Ha ocurrido un error al editar la opinión',
        'error'
      );
    }
    this.mostrarModal = false;
  }

  // cambiarPagina(pagina: number): void {
  //   this.currentPage = pagina;
  //   const startIndex = (pagina - 1) * this.itemsPerPage;
  //   this.opinionesFiltradas = this.opiniones.slice(
  //     startIndex,
  //     startIndex + this.itemsPerPage
  //   );
  // }

  cerrarModal(): void {
    this.mostrarModal = false;
  }
}
