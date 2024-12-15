import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome-message',
  standalone: true,
  templateUrl: './welcome-message.component.html',
  styleUrls: ['./welcome-message.component.css'],
  imports: [CommonModule], // Otras dependencias necesarias
})
export class WelcomeMessageComponent {
  @Input() nombreUsuario: string = ''; // Recibe el nombre del usuario
}
