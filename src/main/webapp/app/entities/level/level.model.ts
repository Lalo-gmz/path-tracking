export interface ILevel {
  id: number;
  name?: string | null;
  order?: number | null;
  minExpe?: number | null;
}

export type NewLevel = Omit<ILevel, 'id'> & { id: null };
