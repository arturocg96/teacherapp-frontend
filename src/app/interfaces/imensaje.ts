export interface Imensaje {
  id: number;
  emisor_id: number;
  destinatario_id: number;
  asunto: string;
  contenido: string;
  leido: boolean;
}

export interface MensajeConEmisor extends Imensaje {
  nombre_emisor: string;
  apellidos_emisor: string;
}

export interface MensajeAgrupado {
  id: number;
  nombre: string;
  apellido: string;
  count: number;
}
