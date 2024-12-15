import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environments';
import { Iopinion } from '../interfaces/iopinion';
import { Iusuario } from '../interfaces/iusuario';

@Injectable({
  providedIn: 'root',
})
export class OpinionesService {
  // Inyectables
  httpClient = inject(HttpClient);

  // Atributos
  baseUrl = `${environment.API_URL}/api/opiniones`;

  // Funciones del ciclo de vida
  constructor() {}

  ngOnInit(): void {}

  getOpinionesFromAlumnoId(alumnoId: number): Promise<Iopinion[]> {
    return firstValueFrom(
      this.httpClient.get<Iopinion[]>(`${this.baseUrl}/estudiante/${alumnoId}`)
    );
  }

  getOpinionesFromProfesorId(alumnoId: number): Promise<Iopinion[]> {
    return firstValueFrom(
      this.httpClient.get<Iopinion[]>(`${this.baseUrl}/profesor/${alumnoId}`)
    );
  }

  getOpinionesByUser(usuario: Iusuario): Promise<Iopinion[] | []> {
    if (!usuario || !usuario.id) return Promise.resolve([]);
    if (usuario.rol === 'alumno')
      return this.getOpinionesFromAlumnoId(usuario.id);
    if (usuario.rol === 'profesor')
      return this.getOpinionesFromProfesorId(usuario.id);

    return Promise.resolve([]);
  }

  addOpinion(opinion: Iopinion): Promise<[Iopinion]> {
    return firstValueFrom(
      this.httpClient.post<[Iopinion]>(this.baseUrl, opinion)
    );
  }

  updateOpinion(opinion: Iopinion): Promise<[Iopinion]> {
    return firstValueFrom(
      this.httpClient.put<[Iopinion]>(
        `${this.baseUrl}/single/${opinion.estudiante_id}/${opinion.profesor_id}`,
        opinion
      )
    );
  }
}
