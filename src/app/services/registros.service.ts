import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environments';
import { Iusuario } from '../interfaces/iusuario';
import { Iregistros } from '../interfaces/iregistros';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: 'root',
})
export class RegistrosService {
  httpClient = inject(HttpClient);
  usuariosService = inject(UsuariosService);

  BASE_URL = `${environment.API_URL}/api/inscripciones`;

  constructor() {}

  async getRegistrosDeUsuario(usuario: Iusuario): Promise<Iregistros[]> {
    if (usuario.rol === 'alumno') {
      return firstValueFrom(
        this.httpClient.get<Iregistros[]>(
          `${this.BASE_URL}/estudiante/${usuario.id}`
        )
      );
    } else if (usuario.rol === 'profesor') {
      return firstValueFrom(
        this.httpClient.get<Iregistros[]>(
          `${this.BASE_URL}/profesor/${usuario.id}`
        )
      );
    }
    return [];
  }

  async darDeBaja(id: number): Promise<Iregistros[]> {
    return firstValueFrom(
      this.httpClient.put<Promise<Iregistros[]>>(
        `${this.BASE_URL}/cerrar/${id}`,
        {}
      )
    );
  }
}
