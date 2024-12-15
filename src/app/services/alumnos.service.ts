import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { Iusuario } from '../interfaces/iusuario';
import { UsuariosService } from './usuarios.service';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AlumnosService {
  // Inyectables
  usuariosService = inject(UsuariosService);
  httpClient = inject(HttpClient);

  // Variables
  BASE_URL = `${environment.API_URL}/api/alumnos`;
  arrAlumnos!: Iusuario[];
  constructor() {
    this.arrAlumnos = this.usuariosService.arrUsuarios.filter(
      (usuario) => usuario.rol === 'alumno'
    );
  }

  // Formularios

  getAlumnoById(id: number): Promise<Iusuario | undefined> {
    return firstValueFrom(
      this.httpClient.get<Iusuario>(`${this.BASE_URL}/${id}`)
    );
  }

  registroAlumno(alumnoDataForm: any): Promise<Iusuario> {
    return firstValueFrom(
      this.httpClient.post<Iusuario>(
        `${this.BASE_URL}/registro`,
        alumnoDataForm
      )
    );
  }

  actualizarAlumno(
    alumnoDataForm: any,
    alumnoId: number | undefined
  ): Promise<Iusuario> {
    return firstValueFrom(
      this.httpClient.put<Iusuario>(
        `${this.BASE_URL}/${alumnoId}`,
        alumnoDataForm
      )
    );
  }

  async listarAlumnos(): Promise<Iusuario[]> {
    return firstValueFrom(this.httpClient.get<Iusuario[]>(this.BASE_URL));
  }
}
