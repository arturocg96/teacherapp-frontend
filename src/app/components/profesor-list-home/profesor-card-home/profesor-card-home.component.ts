import { Component, inject, Input } from '@angular/core';
import { PopUpContactarComponent } from '../pop-up-contactar/pop-up-contactar.component';
import { CommonModule } from '@angular/common';
import { Iprofesor } from '../../../interfaces/iprofesor';
import { environment } from '../../../../environments/environments';
import { ProfesoresService } from '../../../services/profesores.service';

@Component({
  selector: 'app-profesor-card-home',
  standalone: true,
  imports: [PopUpContactarComponent, CommonModule],
  templateUrl: './profesor-card-home.component.html',
  styleUrl: './profesor-card-home.component.css',
})
export class ProfesorCardHomeComponent {
  profesorService = inject(ProfesoresService);

  @Input() myProfesor!: Iprofesor;
  // @Output() openPopUp = new EventEmitter<any>(); // evento para abrir el contenido de pop-up
  API_URL = environment.API_URL;
  popUpVisible = false;

  mostrarPopUp(id: number = 0) {
    this.profesorService.idProfesorSeleccionado = id;
    this.popUpVisible = true;
    // console.log(this.myProfesor.id);
  }

  cerrarPopUp() {
    this.popUpVisible = false;
  }
}
