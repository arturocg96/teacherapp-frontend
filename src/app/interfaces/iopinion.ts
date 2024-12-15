export interface Iopinion {
  estudiante_id: number;
  profesor_id: number;
  puntuacion: number;
  comentario: string;
  fecha: Date;
  estudiante_nombre?: string;
}
