import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environments';

type Body = { email: string };
type Response = { message: string };
type userpass = { code: string; newpass: string };

@Injectable({
  providedIn: 'root',
})
export class PasswordRecoveryService {
  private baseUrl: string = `${environment.API_URL}/api/recuperarclave`;
  private http = inject(HttpClient);

  sendRecoveryEmail(user: Body): Promise<Response> {
    return firstValueFrom(this.http.post<Response>(`${this.baseUrl}`, user));
  }

  recoverypass(myuser: userpass): Promise<Response> {
    console.log(myuser, 'en service');
    return firstValueFrom(
      this.http.post<Response>(`${this.baseUrl}/restablecermiclave`, myuser)
    );
  }

  sendCodeLink(code: string): Promise<any> {
    return firstValueFrom(
      this.http.get<any>(`${this.baseUrl}/restablecermiclave/${code}`)
    );
  }
}
