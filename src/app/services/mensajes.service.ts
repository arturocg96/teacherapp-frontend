import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environments';
import {
  Imensaje,
  MensajeAgrupado,
  MensajeConEmisor,
} from '../interfaces/imensaje';
import { Iusuario } from '../interfaces/iusuario';

@Injectable({
  providedIn: 'root',
})
export class MensajesService {
  http = inject(HttpClient);

  private baseUrl: string = `${environment.API_URL}/api/mensajes`;
  private httpClient = inject(HttpClient);
  private mensajesAgrupadosSubject = new BehaviorSubject<MensajeAgrupado[]>([]); //mensajes agrupados
  mensajesAgrupados$ = this.mensajesAgrupadosSubject.asObservable();

  //obtener mensajes no leidos
  getMensajesNoLeidos(userid: number): Promise<MensajeConEmisor[]> {
    return firstValueFrom(
      this.httpClient.get<MensajeConEmisor[]>(`${this.baseUrl}/${userid}`)
    );
  }

  //obtener solo mis alumnos
  getMisAlumnos(userid: number) {
    return firstValueFrom(
      this.httpClient.get<Iusuario[]>(`${this.baseUrl}/misalumnos/${userid}`)
    );
  }
  getMisProfesores(userid: number) {
    return firstValueFrom(
      this.httpClient.get<Iusuario[]>(`${this.baseUrl}/misprofesores/${userid}`)
    );
  }

  //obtener los mensajes entre 2 usuarios en especifico
  getmsjbetweenusers(
    emisorid: number,
    destinatarioid: number
  ): Promise<Imensaje[]> {
    return firstValueFrom(
      this.httpClient.get<Imensaje[]>(
        `${this.baseUrl}/${emisorid}/${destinatarioid}`
      )
    );
  }

  //envio de mensaje
  sendMessage(mensaje: Imensaje): Promise<Imensaje> {
    return firstValueFrom(
      this.httpClient.post<Imensaje>(`${this.baseUrl}/enviar`, mensaje)
    );
  }

  //cambia estado de mensajes de true a false
  marcarLeido(notificacionid: number): Promise<void> {
    return firstValueFrom(
      this.http.patch<void>(`${this.baseUrl}/${notificacionid}`, { leido: 1 })
    );
  }

  actualizarMensajesAgrupados(mensajes: any[]): void {
    const agrupados = mensajes.reduce((acc, mensaje) => {
      const id = mensaje.emisor_id;
      const nombre = mensaje.nombre_emisor;
      const apellido = mensaje.apellidos_emisor;
      if (!acc[id]) {
        acc[id] = { id, nombre, apellido, count: 0 };
      }
      acc[id].count++;
      return acc;
    }, {} as { [id: number]: MensajeAgrupado });
    // Convertir el objeto agrupado a un array
    const mensajesAgrupados: MensajeAgrupado[] = Object.values(agrupados);
    // Emitir los nuevos mensajes agrupados
    this.mensajesAgrupadosSubject.next(mensajesAgrupados);
  }
}
