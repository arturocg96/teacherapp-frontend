import { Component, inject, signal } from '@angular/core';
import { ProfesoresService } from '../../services/profesores.service';
import { Iprofesor } from '../../interfaces/iprofesor';
import { FilterHomeComponent } from './filter-home/filter-home.component';
import { ProfesorCardHomeComponent } from './profesor-card-home/profesor-card-home.component';
import { MapaHomeComponent } from './mapa-home/mapa-home.component';
import { GoogleMap } from '@angular/google-maps';
import { environment } from '../../../environments/environments';
import { PopUpContactarComponent } from './pop-up-contactar/pop-up-contactar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profesor-list-home',
  standalone: true,
  imports: [
    FilterHomeComponent,
    ProfesorCardHomeComponent,
    MapaHomeComponent,
    GoogleMap,
    PopUpContactarComponent,
    CommonModule,
  ],
  templateUrl: './profesor-list-home.component.html',
  styleUrl: './profesor-list-home.component.css',
})
export class ProfesorListHomeComponent {
  //injectable
  profesorService = inject(ProfesoresService);

  //Variables
  profesoresListFilter: Iprofesor[] = [];
  marcasList: any[] = [];
  profesoresList: Iprofesor[] = [];
  myposition = signal<any>('');
  isGoogleMapsLoaded = false;

  async ngOnInit() {
    // Cargar el script de Google Maps dinámicamente
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.token}`;
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);

    // Esperar a que el script se cargue
    script.onload = () => {
      this.isGoogleMapsLoaded = true;
      this.initializeMap();
    };

    script.onerror = () => {
      console.error('Error al cargar Google Maps');
    };

    //-----------------------------------------------------------------------

    this.profesoresList = await this.profesorService.getMateriasandProfesor();

    this.profesoresList = this.profesoresList.filter(
      (profesor) => Boolean(profesor.validado) === true
    );

    this.ordenarAlabeticamente();

    this.profesoresListFilter = this.profesoresList.slice();

    this.muestracoordenadas();
  }

  private initializeMap() {
    if (this.isGoogleMapsLoaded) {
      navigator.geolocation.getCurrentPosition((position) => {
        let center = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        this.myposition.set(center);
      });
    }
  }

  filterProfesor(event: any) {
    this.profesoresList = this.profesoresListFilter;

    if (event[0] != '0' && event[0] != '') {
      this.profesoresList = this.profesoresListFilter.filter((res) =>
        res.materias.includes(event[0])
      );
    }
    if (event[3] === '0' && event[0] === '' && event[0] === '0') {
      this.profesoresList = this.profesoresListFilter;
    }

    if (event[1] != '' || event[2] != '') {
      let valmin = Number(event[1]);
      let valmax = Number(event[2]);

      this.profesoresList = this.profesoresList.filter((obj) => {
        const precio = Number(obj.precio_hora);
        return precio >= valmin && precio <= valmax;
      });
    }

    if (event[3] != '' && event[3] != '0') {
      this.profesoresList = this.profesoresList.filter((item) => {
        if (item.puntuacion !== null) {
          const valorPuntuacion = item.puntuacion;

          return valorPuntuacion >= parseFloat(event[3]) - 0.5;

          // return (
          //   valorPuntuacion >= parseFloat(event[3]) &&
          //   valorPuntuacion < parseFloat(event[3]) + 1
          // );
        }
        return false;
      });
      this.ordenarPuntuacion();
    }

    if (event[5] != '' && event[5] != '0') {
      this.profesoresList = this.profesoresList.filter((obj) => {
        const mes = obj.meses_experiencia;

        return mes <= event[5] * 12;
      });
      this.ordenaExperiencia();
    }

    //-------ORDENAR
    if (event[4] === 'nombre') {
      this.ordenarAlabeticamente();
    }

    if (event[4] === 'precio') {
      this.profesoresList.sort((a, b) => {
        const precioA = a.precio_hora;
        const precioB = b.precio_hora;

        return precioB - precioA;
      });
    }

    if (event[4] === 'puntuacion') {
      this.ordenarPuntuacion();
    }

    if (event[4] === 'experiencia') {
      this.ordenaExperiencia();
    }

    this.muestracoordenadas();
  }

  ordenaExperiencia() {
    this.profesoresList = this.profesoresList.sort(
      (a, b) => b.meses_experiencia - a.meses_experiencia
    );
  }

  ordenarAlabeticamente() {
    this.profesoresList.sort((a, b) => {
      const nombreA = a.nombre.toLowerCase();
      const nombreB = b.nombre.toLowerCase();

      if (nombreA < nombreB) {
        return -1;
      }
      if (nombreA > nombreB) {
        return 1;
      }
      return 0;
    });
  }

  ordenarPuntuacion() {
    const validData = this.profesoresList.filter(
      (item) => item.puntuacion !== null
    );

    validData.sort((a, b) => b.puntuacion - a.puntuacion);

    this.profesoresList = validData;
  }

  muestracoordenadas() {
    const result = this.profesoresList
      .map((item) => {
        try {
          // Verificar que la localización sea válida
          if (!item.localizacion) {
            console.warn(
              `Localización vacía para el profesor con ID: ${item.id}`
            );
            return null; // Devuelve un valor vacío o manejable
          }

          const localizacion = JSON.parse(item.localizacion);

          // Verificar que localizacion tenga los datos esperados
          if (!localizacion.lat || !localizacion.lng || !localizacion.address) {
            console.warn(
              `Localización incompleta para el profesor con ID: ${item.id}, llena el formato correcto en localizacion`,
              localizacion
            );
            return null; // Devuelve un valor vacío o manejable
          }

          return {
            nombre: item.nombre,
            foto: item.foto,
            precio: item.precio_hora,
            id: item.id,
            address: ` ${localizacion.address}`,
            coordenadas: ` ${localizacion.lat},${localizacion.lng}`,
          };
        } catch (error) {
          console.error(
            `Error al parsear localización para el profesor con ID : ${item.id}, llena el formato correcto en localizacion`,
            error
          );
          return null; // Maneja errores de parseo
        }
      })
      .filter((item) => item !== null); // Filtra los resultados nulos

    this.marcasList = result;
  }

  profesorSeleccionado: any = null; // Variable para almacenar el profesor seleccionado
}
