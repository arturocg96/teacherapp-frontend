import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, lastValueFrom } from 'rxjs';

import { environment } from '../../environments/environments';
import { Iprofesor } from '../interfaces/iprofesor';
import { UsuariosService } from './usuarios.service';
import { Iusuario } from '../interfaces/iusuario';
import { IRespuestaTeachersForm } from '../interfaces/iRespuestaTeachersForm.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfesoresService {
  // Inyectables
  usuariosService = inject(UsuariosService);
  httpClient = inject(HttpClient);

  // Variables
  BASE_URL = `${environment.API_URL}/api/profesores`;
  idProfesorSeleccionado: number = 0;

  //HOME
  getAllProfesores() {
    return lastValueFrom(this.httpClient.get<Iprofesor[]>(this.BASE_URL));
  }

  async getMateriasandProfesor(): Promise<Iprofesor[]> {
    return lastValueFrom(
      this.httpClient.get<Iprofesor[]>(`${this.BASE_URL}/profesor-materias`)
    );
  }

  //FORMULARIO REGISTRO Y PROFESOR
  getProfesorById(id: number): Promise<IRespuestaTeachersForm | undefined> {
    return firstValueFrom(
      this.httpClient.get<IRespuestaTeachersForm>(`${this.BASE_URL}/${id}`)
    );
  }

  async registroProfesor(formData: FormData): Promise<any> {
    return firstValueFrom(
      this.httpClient.post<Iusuario>(`${this.BASE_URL}/registro`, formData)
    );
  }

  async actualizarProfesor(formData: FormData, id: number): Promise<any> {
    return firstValueFrom(
      this.httpClient.put<Iusuario>(`${this.BASE_URL}/${id}`, formData)
    );
  }

  //Panel administrador
  async listarProfesores(): Promise<Iprofesor[]> {
    return firstValueFrom(this.httpClient.get<Iprofesor[]>(this.BASE_URL));
  }

  async validarProfesor(
    id: number,
    validado: boolean
  ): Promise<{ message: string }> {
    const url = `${this.BASE_URL}/validar/${id}`;
    return firstValueFrom(
      this.httpClient.put<{ message: string }>(url, { validado })
    );
  }

  async actualizarSobreMi(id: number, sobre_mi: string) {
    return firstValueFrom(
      this.httpClient.patch(`${this.BASE_URL}/sobremi/${id}`, { sobre_mi })
    );
  }
}
