import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
})
export class LogoutComponent {
  router = inject(Router);

  ngOnInit(): void {
    localStorage.clear();
    this.router.navigate(['/home']);
  }
}
