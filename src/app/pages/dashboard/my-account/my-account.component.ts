import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Iusuario } from '../../../interfaces/iusuario';
import { LoginService } from '../../../services/login.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { StudentsFormComponent } from '../../students-form/students-form.component';
import { TeachersFormComponent } from '../../teachers-form/teachers-form.component';
import { PanelAdministradorComponent } from '../../panel-administrador/panel-administrador.component';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css',
  standalone: true,
  imports: [
    CommonModule,
    StudentsFormComponent,
    TeachersFormComponent,
    PanelAdministradorComponent,
  ],
})
export class MyAccountComponent implements OnInit {
  // Inyectables
  loginService = inject(LoginService);
  usuariosService = inject(UsuariosService);

  // Variables
  usuarioLogueado!: Iusuario;

  // Constructor
  constructor() {}

  async ngOnInit(): Promise<void> {
    this.usuarioLogueado = await this.usuariosService.getUsuarioActual();
  }
}
