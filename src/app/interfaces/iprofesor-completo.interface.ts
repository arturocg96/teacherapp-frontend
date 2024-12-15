import { Iusuario } from '../interfaces/iusuario';
import { Imateria } from '../interfaces/imateria';
export interface IProfesorCompleto {
  usuario: Iusuario;
  profesor: {
    id?: number; 
    usuarios_id?: number; 
    precio_hora: number;
    localizacion: string;
    telefono: number;
    meses_experiencia: number;
    validado: boolean;
  };
  materias: Imateria[];
}
