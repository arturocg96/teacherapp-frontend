import { Component, Input, EventEmitter, Output, inject } from '@angular/core';
import { Iprofesor } from '../../../interfaces/iprofesor';
import { Iopinion } from '../../../interfaces/iopinion';
import { Iusuario } from '../../../interfaces/iusuario';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
export class PopUpContactarComponent {
  @Input() myProfesor: any; 
  @Input() profesorId: number | undefined;
  @Output() cerrarPopUp = new EventEmitter<void>();
  @Output() redirectregister = new EventEmitter<void>();

  usuariosService = inject(UsuariosService);
  profesoresService = inject(ProfesoresService);
  opinionesService = inject(OpinionesService);
  loginService = inject(LoginService);
  inscripcionesService = inject(InscripcionesService);

  usuario!: Iusuario;
  profesores: Iprofesor[] = [];
  opinionesProfesor: Iopinion[] = [];
  login: boolean = false;
  id_alumno: number = 0;
  id_profesor: number = 0;
  URLAPI: string = environment.API_URL;

  constructor(private router: Router) {}

  cerrar() {
    this.cerrarPopUp.emit();
  }

  redirect() {
    if (!this.login) {
      this.router.navigate(['/login']);
      return;
    }

    this.id_alumno = this.loginService.getLoggedUserId();
    this.id_profesor = this.myProfesor?.usuario_id;

    if (!this.id_alumno || !this.id_profesor) {
      console.error('Faltan datos para la inscripción');
      return;
    }

    this.inscripcionesService
      .postInscription(this.id_alumno, this.id_profesor)
      .subscribe({
        next: (response) => {
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
          console.error('Error en la inscripción', err);
        },
      });
  }

  async ngOnInit(): Promise<void> {
    this.login = this.loginService.isLogged();
    this.profesorId = this.profesoresService.idProfesorSeleccionado;

    try {
      const profesores = await this.profesoresService.getMateriasandProfesor();
      if (this.profesorId) {
        this.myProfesor = profesores.find((profesor) => profesor.id === this.profesorId);
      }

      if (this.myProfesor) {
        this.opinionesProfesor = this.myProfesor.opiniones || [];
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  }

  onImageError(event: Event) {
    const element = event.target as HTMLImageElement;
    element.src = '/img/no_profile_freepick.webp';
  }
}
