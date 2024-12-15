import { Component, Input, signal } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-mapa-home',
  standalone: true,
  imports: [MapMarker, MapInfoWindow],
  templateUrl: './mapa-home.component.html',
  styleUrl: './mapa-home.component.css',
})
export class MapaHomeComponent {
  @Input() myCoordenada!: any;
  myposition = signal<any>('');
  profesoresList: any = [];
  API_URL = environment.API_URL;

  ngOnInit() {
    //api de geolocalizacion de js nativa
    navigator.geolocation.getCurrentPosition((position) => {
      let center = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      this.myposition.set(center);
    });
  }

  getposition(coords: any) {
    let resultado: string = coords;
    let array: any[] = resultado.split(',');
    return new google.maps.LatLng(array[0], array[1]);
  }

  //metodo para abrir el infowindow
  openInfoWindow(marker: MapMarker, infowindow: MapInfoWindow) {
    infowindow.open(marker);
  }
}
