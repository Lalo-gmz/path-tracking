export interface IStatus {
  id: number;
  name?: string | null;
  order?: number | null;
}

export type NewStatus = Omit<IStatus, 'id'> & { id: null };
