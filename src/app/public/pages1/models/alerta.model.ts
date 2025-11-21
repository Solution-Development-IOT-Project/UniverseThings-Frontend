export interface Alerta {
  id: number;
  tipo: string;
  descripcion: string;
  sector: string;
  tiempo: string;
  temperatura?: string;
  estado: 'Activa' | 'Pendiente' | 'Resuelta';
  prioridad: 'Alta' | 'Media' | 'Baja';
}
