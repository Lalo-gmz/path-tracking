export interface IDificulty {
  id: number;
  name?: string | null;
  points?: number | null;
}

export type NewDificulty = Omit<IDificulty, 'id'> & { id: null };
