import { Component, inject, Input, OnInit, Output, output, Signal, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Iusuario } from '../../../interfaces/iusuario';
import { Imensaje, MensajeAgrupado, MensajeConEmisor } from '../../../interfaces/imensaje';
import { LoginService } from '../../../services/login.service';
import { MensajesService } from '../../../services/mensajes.service';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class MessagesComponent implements OnInit {
  loginService = inject(LoginService);
  messagesService= inject(MensajesService);
  mensajesAgrupados: MensajeAgrupado[] = [];

  notifications:MensajeConEmisor[]=[];  
  mensajes: Imensaje[] = [];
  arrAlumnos:Iusuario[]=[];
  arrProf:Iusuario[]=[];
  contactoSeleccionado: Iusuario | null = null;
  contactoSeleccionadoid:number = 0;
  usuarioId:number = 0;
  role:string = ''; 
  login: boolean = false;
  mensajeOrigin:string= '';
  chatForm: FormGroup;
  notiCount:number = 0; 
  API_URL= environment.API_URL;
  
  constructor() {
    this.chatForm = new FormGroup({
      contenido: new FormControl(null,[
        Validators.required
      ])
    })
  }

  ngOnInit() {
    this.login = this.loginService.isLogged();  
    if (this.login) {      
      this.role = this.loginService.getLoggedUserRole();
      this.usuarioId = this.loginService.getLoggedUserId();      

      if (this.role === 'profesor') {
      this.obtenerAlumnos();
      }
      if (this.role === 'alumno') {
        this.obtenerProfesores();
        }

        this.messagesService.mensajesAgrupados$.subscribe((agrupados) => {
          this.mensajesAgrupados = agrupados;
          this.notiCount = agrupados.reduce((acc, mensaje) => acc + mensaje.count, 0);
        });
      
        this.cargarMensajesNoLeidos();

    }   
  }

  //contador de mensajes sin leer de un usuario para mostrar badge
  getMensajesNoLeidosPorUsuario(userId: number | undefined):number {
    const usuario = this.mensajesAgrupados.find((mensaje) => mensaje.id === userId);
    return usuario ? usuario.count : 0;
  }


  /* obtener mis alumnos */
  async obtenerAlumnos():Promise<void>{
    try {
      this.arrAlumnos = await this.messagesService.getMisAlumnos(this.usuarioId);
    } catch (error) {
      console.error('Error al obtener alumnos:', error);
    }
  }
  /* obtener mis profesores */
  async obtenerProfesores():Promise<void>{
    try {
      this.arrProf = await this.messagesService.getMisProfesores(this.usuarioId);
    } catch (error) {
      console.error('Error al obtener profesores:', error);
    }
  }
  /* actualizar notificacion */
  async cargarMensajesNoLeidos(): Promise<void> {
    try {         
      const response = await this.messagesService.getMensajesNoLeidos(this.usuarioId);  
      this.notifications = response || [] //asignamos respuesta a notifications   
      if(this.notifications.length){
      this.notiCount = this.notifications.length;// Actualizamos el número de mensajes no leídos
      console.log(this.notiCount)
      }      
    } catch (error) {
      console.error('Error al obtener mensajes no leídos:', error);
      this.notiCount= 0;
    }
  }  

  // Función para seleccionar un contacto
  async seleccionarContacto(contacto: Iusuario): Promise<void> {
    this.contactoSeleccionado = contacto;
    this.contactoSeleccionadoid = contacto.id || 0;   
    await this.cargarMensajesNoLeidos();    
    await this.marcarNotificacionesComoLeidas(this.contactoSeleccionadoid);
    await this.cargarMensajes(this.contactoSeleccionadoid);    
    this.scrollaluttimomssj();  
  }

   // Función para cargar los mensajes entre el usuario y el contacto seleccionado
  async cargarMensajes(contactoId: number): Promise<void> {
    const mensajes = await this.messagesService.getmsjbetweenusers(this.usuarioId, contactoId);
    this.mensajes = mensajes;    
  }

  async marcarNotificacionesComoLeidas(emisorId: number): Promise<void> {
    try {
      const notificacionesDeEmisor = this.notifications.filter(n => n.emisor_id === emisorId);  
      for (const noti of notificacionesDeEmisor) {        
        await this.messagesService.marcarLeido(noti.id); 
      }
      this.notifications = this.notifications.filter(n => n.emisor_id !== emisorId);       
      this.messagesService.actualizarMensajesAgrupados(this.notifications); //Manda el nuevo estado al servicio para q la campana muestre los cambios
      const notificationUnRead = this.notifications.filter(mensaje =>!mensaje.leido);      
      this.notiCount = notificationUnRead.length;        
    } catch (error) {
      console.error('Error al marcar notificaciones como leídas:', error);
    }
  }

  /* Captura el contenido del formulario */
  getdata():void {
    const mensaje = this.chatForm.value.contenido;
    if (!mensaje || mensaje.trim() === '') {      
      return;  
    }    
     // Validar que el destinatario esté seleccionado
    if (!this.contactoSeleccionadoid) {
      return;
    }

    this.sendMensaje({
      id: 0,
      emisor_id: this.usuarioId,  // El emisor es el usuario logueado
      destinatario_id: this.contactoSeleccionadoid,  // Usamos el ID del contacto seleccionado
      asunto: '',
      contenido: mensaje,
      leido: false
    });
  }

   /* Enviar un mensaje */
  async sendMensaje(mensajeorgin:Imensaje): Promise<void> {
      const mensajeform: Imensaje = {
        id:0,
        emisor_id: this.usuarioId,  // El emisor es el usuario logueado
        destinatario_id: mensajeorgin.destinatario_id,  // El destinatario es el contacto seleccionado
        asunto: '',
        contenido: mensajeorgin.contenido,
        leido: false,
      };
      const mensajeEnviado = await this.messagesService.sendMessage(mensajeform);  
      this.mensajes.push(mensajeEnviado);
      this.chatForm.reset(); 
      ;    
      this.scrollaluttimomssj();
  }

  //funcion para mostrar solo una apellidos
  getPrimerApellido(apellidos: string): string {
    if (!apellidos) return ''; 
    return apellidos.trim().split(' ')[0]; 
  }

  /* buscador por nombre */
  queryChanged(value: string): void {
    const word = value.trim().toLowerCase();
    if (word) {
      // Si hay texto en el campo, aplicamos el filtro
      if (this.role === 'profesor') {
        this.arrAlumnos = this.arrAlumnos.filter(user =>
          user.nombre.toLowerCase().includes(word) ||
          user.apellidos.toLowerCase().includes(word)
        );
      } else if (this.role === 'alumno') {
        this.arrProf = this.arrProf.filter(user =>
          user.nombre.toLowerCase().includes(word) ||
          user.apellidos.toLowerCase().includes(word)
        );
      }
    } else {
      // Si el campo está vacío, restablecemos la lista a la original
      if (this.role === 'profesor') {
        this.obtenerAlumnos();
      } else if (this.role === 'alumno') {
        this.obtenerProfesores();
      }
    }
  }

  //scroll al chat ultimo mensaje cuando se abre el chat y cuando envias un mensaje
  scrollaluttimomssj(){
    setTimeout(() => {
    const mensaje = document.getElementsByClassName('chat-message'); 
    const ultimo:any = mensaje[mensaje.length - 1];
    const contenedor = document.getElementById('contmsj');
    if(contenedor && ultimo){   
      const irabajo = ultimo.offsetTop;        
      if (!isNaN(irabajo)) {        
        contenedor.scrollTop = irabajo;      
      }  
    } else {
      return;      
    }
    }, 0); 
  }
}
