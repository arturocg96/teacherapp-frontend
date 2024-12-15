import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Iusuario } from '../../interfaces/iusuario';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css'],
  imports: [CommonModule, RouterModule], // Otras dependencias necesarias
})
export class SidebarMenuComponent {
  @Input() usuario!: Iusuario;
}
