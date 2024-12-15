import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environments';
import { Iusuario } from '../interfaces/iusuario';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  arrUsuarios: Iusuario[] = [];

  httpClient = inject(HttpClient);
  loginService = inject(LoginService);

  BASE_URL = `${environment.API_URL}/api/usuarios`;

  constructor() {
    this.initComponent();
  }

  async initComponent() {
    this.arrUsuarios = await this.getAllUsers();
  }

  getAllUsers(): Promise<Iusuario[]> {
    return firstValueFrom(this.httpClient.get<Iusuario[]>(`${this.BASE_URL}`));
  }

  getUsuarioActual(): Promise<Iusuario> {
    const idUsuario = this.loginService.getLoggedUserId();
    return firstValueFrom(
      this.httpClient.get<Iusuario>(`${this.BASE_URL}/${idUsuario}`)
    );
  }

  getUsuarioById(id: number): Promise<Iusuario> {
    return firstValueFrom(
      this.httpClient.get<Iusuario>(`${this.BASE_URL}/${id}`)
    );
  }

  // Método para activar o desactivar un usuario
  async activarUsuario(
    id: number,
    activo: boolean
  ): Promise<{ message: string }> {
    const url = `${this.BASE_URL}/activar/${id}`;
    return firstValueFrom(
      this.httpClient.put<{ message: string }>(url, { activo })
    );
  }
}
