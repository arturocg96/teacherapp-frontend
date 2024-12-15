import { Component, Input, EventEmitter, Output, inject } from '@angular/core';
import { Iprofesor } from '../../../interfaces/iprofesor';
import { Iopinion } from '../../../interfaces/iopinion';
import { Iusuario } from '../../../interfaces/iusuario';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios.service';
import { ProfesoresService } from '../../../services/profesores.service';
import { OpinionesService } from '../../../services/opiniones.service';

import { LoginService } from '../../../services/login.service';
import { InscripcionesService } from '../../../services/inscripciones.service';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environments';

@Component({
  standalone: true,
  selector: 'app-pop-up-contactar',
  templateUrl: './pop-up-contactar.component.html',
  styleUrls: ['./pop-up-contactar.component.css'],
  imports: [CommonModule],
})
// routerlink y starrating
export class PopUpContactarComponent {
  @Input() myProfesor: any; // Recibimos el profesor seleccionado
  @Input() profesorId: number | undefined;
  @Output() cerrarPopUp = new EventEmitter<void>();
  @Output() redirectregister = new EventEmitter<void>();

  // Instanciar servicios
  usuariosService = inject(UsuariosService);
  profesoresService = inject(ProfesoresService);
  opinionesService = inject(OpinionesService);
  loginService = inject(LoginService);
  inscripcionesService = inject(InscripcionesService);

  usuario!: Iusuario;
  // profesor!: any;
  profesores: Iprofesor[] = [];
  sobre_mi: string = '';
  opinionesProfesor: Iopinion[] = [];
  opinion: any;
  login: boolean = false;
  id_alumno: number = 0;
  id_profesor: number = 0;
  success_message: string = '';
  show_message: boolean = false;
  URLAPI: string = environment.API_URL;

  constructor(private router: Router) {}

  cerrar() {
    this.cerrarPopUp.emit();
  }

  redirect() {
    //para comprobar que estamos logueados
    if (!this.login) {
      this.router.navigate(['/login']);
      return;
    }

    this.id_alumno = this.loginService.getLoggedUserId();
    this.id_profesor = this.myProfesor?.usuario_id;

    if (!this.id_alumno || !this.id_profesor) {
      console.error('faltan datos para la inscripcion');
      return;
    }
    this.inscripcionesService
      .postInscription(this.id_alumno, this.id_profesor)
      .subscribe({
        next: (response) => {
          console.log(response);
          // this.success_message = "Éxito en la inscripción";
          // this.show_message = true;
          Swal.fire({
            icon: 'success',
            title: '"Inscripción" actualizada',
            text: '¡Ya estás inscrito en tus clases con este profesor!',
            showConfirmButton: false,
            timer: 1500,
          });
          this.cerrarPopUp.emit();
        },
        error: (err) => {
          this.show_message = false;
          console.error('error en la inscripción', err);
        },
      });

    if (this.login) {
      this.id_alumno = this.loginService.getLoggedUserId();
    } else {
      this.router.navigate(['/login']);
    }
  }

  async ngOnInit(): Promise<void> {
    this.login = this.loginService.isLogged();
    this.profesorId = this.profesoresService.idProfesorSeleccionado;
    try {
      // Obtener todos los profesores
      const profesores = await this.profesoresService.getMateriasandProfesor();

      // Filtrar para obtener solo el profesor con el ID específico
      if (this.profesorId) {
        this.myProfesor = profesores.find(
          (profesor) => profesor.id === this.profesorId
        );
      }

      // Si encontramos al profesor, extraemos las opiniones
      if (this.myProfesor) {
        this.opinionesProfesor = this.myProfesor.opiniones || [];
        // console.log('Opiniones:', this.opinionesProfesor); // Verifica las opiniones en la consola
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  }
}
