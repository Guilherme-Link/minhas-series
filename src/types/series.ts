export interface Serie {
  id: number;
  titulo: string;
  plataforma: string;
  temporadas: number;
  nota: number | null;
  concluida: number; // 0 = assistindo, 1 = concluída
  createdAt: string; // ISO 8601
}

export interface CreateSerieInput {
  titulo: string;
  plataforma: string;
  temporadas: number;
  nota: number | null;
}

export interface UpdateSerieInput {
  titulo: string;
  plataforma: string;
  temporadas: number;
  nota: number | null;
  concluida: number;
}

export type SerieFilter = 'todas' | 'assistindo' | 'concluidas';
