import { Component, inject } from '@angular/core';
import { EmailValidator, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { LoginService } from '../../services/login.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Iusuario } from '../../interfaces/iusuario';
import { CommonModule } from '@angular/common';
import { PasswordRecoveryService } from '../../services/password-recovery.service';

type Response = { message: string; token: string };
type res = { message: string };

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    RouterLink,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  recoverypass = inject(PasswordRecoveryService);
  loginService = inject(LoginService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  error: boolean = false;
  msg: string = '';
  errorForm: any[] = [];
  email: string = '';
  showAlert: boolean = false;
  erroremail: boolean = false;

  ngOnInit() {}

  async getLoginData(formValue: Iusuario, form: any) {
    console.log('En funcion');
    try {
      this.error = false;
      console.log(formValue);
      let response: Response = await this.loginService.login(formValue);
      console.log(response);
      console.log(response.message);
      if (response.message === 'Login correcto') {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboard']);
      }
    } catch ({ error }: any) {
      console.log(error);
      this.error = true;
      this.msg = error.message;

      form.reset();
    }
  }

  //Desarrollo lógica de la alerta
  toggleAlert(event: Event): void {
    event.preventDefault();
    this.showAlert = !this.showAlert;
  }

  //solicitar correo a usuario y enviar al backend
  async getemail(resetKeyForm: Iusuario, form: any) {
    //const email = resetKeyForm.email.trim();
    try {
      this.erroremail = false;
      const resp: res = await this.recoverypass.sendRecoveryEmail(resetKeyForm);
      if (resp.message === 'email correcto') {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '¡Correo enviado!',
          text: 'Se ha enviado un correo de recuperacion',
          showConfirmButton: false,
          timer: 3500,
        });
      }
    } catch ({ error }: any) {
      this.erroremail = true;
      this.msg = error.message;

      form.reset();
    }
  }
}
