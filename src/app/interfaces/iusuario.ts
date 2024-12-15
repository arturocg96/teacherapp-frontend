export interface Iusuario {
  id?: number;
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  rol: string;
  foto?: string;
  activo: boolean;
}
