import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { jwtDecode, JwtPayload } from 'jwt-decode';

import { Iusuario } from '../interfaces/iusuario';
import { environment } from '../../environments/environments';

type Body = { email: string; password: string };
type Response = { message: string; token: string };
interface CustomPayload extends JwtPayload {
  usuario_id: number;
  usuario_rol: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseUrl: string = `${environment.API_URL}/api`;
  private http = inject(HttpClient);

  login(user: Body): Promise<Response> {
    console.log(`${this.baseUrl}/login`);
    console.log(user);

    return firstValueFrom(
      this.http.post<Response>(`${this.baseUrl}/login`, user)
    );
  }

  isLogged(): boolean {
    const token = localStorage.getItem('token');
    return token ? true : false;
  }

  getLoggedUserId(): number {
    const token = localStorage.getItem('token');
    const data = jwtDecode<CustomPayload>(token!);
    return data.usuario_id;
  }

  getLoggedUserRole(): string {
    const token = localStorage.getItem('token');
    const data = jwtDecode<CustomPayload>(token!);
    return data.usuario_rol;
  }
}
