import { CommonModule } from '@angular/common';
import { Component, inject} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { MensajesService } from '../../services/mensajes.service';
import { MensajeAgrupado, MensajeConEmisor } from '../../interfaces/imensaje';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  loginService = inject(LoginService);
  serviceMensaje= inject(MensajesService);
  router= inject(Router);

  notifications:MensajeConEmisor[]=[];
  mensajesAgrupados: MensajeAgrupado[] = [];     
  login: boolean = false;
  showNotifications= false; 
  role:string = '';  
  userid:number = 0;
  notiCount:number = 0;  
 
  ngOnInit() {
    this.login = this.loginService.isLogged();
    if (this.login) {
      this.role = this.loginService.getLoggedUserRole();
      this.userid = this.loginService.getLoggedUserId();

      this.serviceMensaje.mensajesAgrupados$.subscribe((agrupados) => {
        this.mensajesAgrupados = agrupados;
        this.notiCount = agrupados.reduce((acc, mensaje) => acc + mensaje.count, 0); // Contar los mensajes no leídos
      });
      this.cargarMensajesNoLeidos();
    }
  }
 
  //cuando login es true se ejecuta la funcion
  async cargarMensajesNoLeidos(): Promise<void> {
    try {         
      const response = await this.serviceMensaje.getMensajesNoLeidos(this.userid);  
      this.notifications = response || [] //asignamos respuesta a notifications  
      // Actualizamos los mensajes agrupados desde el servicio
      this.serviceMensaje.actualizarMensajesAgrupados(this.notifications);
    } catch (error) {
      console.error('Error al obtener mensajes no leídos:', error);
      this.notiCount= 0;
    }
  }  

  /* limpia las notificaciones solo de un usuario seleccionado */
  async readNotifications(emisorId: number): Promise<void> {
    try {
      // Filtramos todas las notificaciones de un mismo emisor
      const notificacionesDeEmisor = this.notifications.filter(n => n.emisor_id === emisorId);  
      // usamos un ciclo for para marcar cada notificación como leída
      for (const noti of notificacionesDeEmisor) {
        await this.serviceMensaje.marcarLeido(noti.id); 
      }  
      // Eliminar todas las notificaciones de ese emisor de la lista
      this.notifications = this.notifications.filter(n => n.emisor_id !== emisorId); 
      this.mensajesAgrupados = this.mensajesAgrupados.filter(group => group.id !== emisorId);       
      
      // Actualizar el contador de notificaciones no leídas
      const notificationUnRead = this.notifications.filter(mensaje =>!mensaje.leido); 
      this.notiCount = notificationUnRead.length;  
    } catch (error) {
      console.error(`Error al marcar las notificaciones como leídas:`, error);
    }
  }  

  /* limpia todas las notificaciones */
  async limpiarNotificaciones():Promise<void>{
    try {
      //actualiza el estado en DB/marca como leido
      const actualizarNotificaciones = this.notifications.map(noti =>
        this.serviceMensaje.marcarLeido(noti.id)
      )
      await Promise.all(actualizarNotificaciones);
      //actualiza la campana cada vez q toque una notificacion
      this.notifications = [];
      this.notiCount = 0;      
      } catch (error) {
          console.error(`Error al marcar la notificación como leída:`, error);
      }
  }
  
  /* desplega listado de notificaciones */
  async toggleNotificaciones(){
    this.showNotifications = !this.showNotifications;
  }

  

}
