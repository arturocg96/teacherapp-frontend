import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { PasswordRecoveryService } from '../../services/password-recovery.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

type userpass = {
  code: string;
  newpass: string;
};

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [ReactiveFormsModule, NavbarComponent, FooterComponent],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.css',
})
export class PasswordRecoveryComponent {
  code: string = '';
  newpass: string = '';
  msg: string = '';
  passFrom: FormGroup;
  route = inject(ActivatedRoute);
  recuperarpass = inject(PasswordRecoveryService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  errorForm: any[] = [];
  tipo: string = 'Registra';
  limiteMateriasExcedido = false;
  desplegableAbierto = false;
  redirect: boolean = false;

  constructor() {
    this.passFrom = new FormGroup(
      {
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(255),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/),
        ]),
        repitepassword: new FormControl(null, [Validators.required]),
      },
      { validators: this.validadorCoincidenciaContraseñas }
    );
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.code = params['code'];
    });
    this.linkCaducado();
  }

  async linkCaducado() {
    try {
      const result = await this.recuperarpass.sendCodeLink(this.code);
      this.redirect = false; // Si el link no está caducado, cargar el componente
    } catch (error: any) {
      this.msg = error.message;
      if (error.status === 401) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          showCancelButton: true,
          cancelButtonText: `<i class="fa fa-thumbs-up px-5"></i> `,
          title: 'Oops...',
          text: '¡Algo salió mal!',
          footer:
            'Puedes solicitar un nuevo enlace para restablecer tu contraseña',
          showCloseButton: true,
          showConfirmButton: false,
        });
        this.router.navigate(['/login']);
        this.redirect = true; // Si el link está caducado, redirige alert
      }
    }
  }

  validadorCoincidenciaContraseñas: ValidatorFn = (
    group: AbstractControl
  ): { [key: string]: any } | null => {
    const password = group.get('password')?.value;
    const repitepassword = group.get('repitepassword')?.value;
    return password === repitepassword ? null : { checkpassword: true };
  };

  checkControl(formControlName: string, validador: string) {
    return (
      this.passFrom.get(formControlName)?.hasError(validador) &&
      this.passFrom.get(formControlName)?.touched
    );
  }

  async passwordForm() {
    this.newpass = this.passFrom.value.password;
    try {
      if (this.passFrom.valid) {
        const user = {
          code: this.code,
          newpass: this.newpass,
        };
        const res = await this.recuperarpass.recoverypass(user);
        if (res.message === 'contraseña actualizada') {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: '¡Felicidades!',
            text: 'Se ha restablecido su contraseña',
            showConfirmButton: false,
            timer: 3000,
          });
          this.router.navigate(['/login']);
        }
      }
    } catch ({ error }: any) {
      this.msg = error.message;
    }
  }
}
