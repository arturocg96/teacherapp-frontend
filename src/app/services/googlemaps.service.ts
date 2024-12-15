import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Feature, Iresponse } from '../interfaces/icoordinates';

@Injectable({
  providedIn: 'root',
})
export class GooglemapsService {
  private http = inject(HttpClient);
  places: Feature[] = [];
  isLoading: boolean = false;

  getCoordByQuery(query: string = '') {
    this.isLoading = true;
    this.http
      .get<Iresponse>(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${query}&language=es&access_token=${environment.mytoken}`
      )
      .subscribe((resp) => {
        this.isLoading = false;
        this.places = resp.features;
      });
  }
}
