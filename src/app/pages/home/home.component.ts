import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProfesorCardHomeComponent } from '../../components/profesor-list-home/profesor-card-home/profesor-card-home.component';
import { ProfesorListHomeComponent } from '../../components/profesor-list-home/profesor-list-home.component';
import { FooterComponent } from "../../components/footer/footer.component";
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [  
    ProfesorListHomeComponent,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
}
