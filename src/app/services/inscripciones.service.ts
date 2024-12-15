import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';

type Response = { message: string; token: string };

@Injectable({
  providedIn: 'root',
})
export class InscripcionesService {
  private baseUrl: string = `${environment.API_URL}/api`;
  private http = inject(HttpClient);

  postInscription(id_alumno: number, id_profesor: number) {
    const Body = { id_alumno, id_profesor };

    const url = `${this.baseUrl}/inscripciones/${id_profesor}`;
    return this.http.post<Response>(url, Body);
  }
}
//
