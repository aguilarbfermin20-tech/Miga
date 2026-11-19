export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  /** Hora de salida del horno, "H:MM". */
  horario: string;
  etiqueta: string;
  recienSalido: boolean;
  agotado: boolean;
  /** Nombre del archivo en src/assets/img. */
  foto: string;
  alt: string;
}

export type NombreDia =
  | 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';

export interface Dia {
  dia: NombreDia;
  /** "HH:MM" o null si está cerrado. */
  abre: string | null;
  cierra: string | null;
}

export interface Horarios {
  direccion: string;
  whatsapp: string;
  whatsappVisible: string;
  encargosHasta: string;
  dias: Dia[];
}

export interface Resena {
  texto: string;
  destacado: string;
  autor: string;
}

/** Cantidades por id de producto. */
export type Pedido = Record<string, number>;
