import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Iusuario } from '../../interfaces/iusuario';
import { UsuariosService } from '../../services/usuarios.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SidebarMenuComponent } from '../../components/sidebar-menu/sidebar-menu.component';
import { WelcomeMessageComponent } from '../../components/welcome-message/welcome-message.component';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    SidebarMenuComponent,
    WelcomeMessageComponent,
    RouterModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  usuario!: Iusuario;
  nombreUsuario: string = '';

  router = inject(Router);
  usuariosService = inject(UsuariosService);
  loginService = inject(LoginService);
  isAdmin: Boolean = (this.loginService.getLoggedUserRole() === 'administrador');

  constructor() {}

  async ngOnInit(): Promise<void> {
    try {
      this.usuario = await this.usuariosService.getUsuarioActual();
      this.nombreUsuario = this.usuario?.nombre || 'Usuario'; // Si no hay usuario, muestra 'Usuario' por defecto
    } catch (error) {
      console.error('Error al obtener el usuario actual:', error);
      this.router.navigate(['/']);
    }
  }
}
