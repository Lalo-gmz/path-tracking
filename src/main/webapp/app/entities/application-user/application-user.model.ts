import { IUser } from 'app/entities/user/user.model';
import { ILevel } from 'app/entities/level/level.model';

export interface IApplicationUser {
  id: number;
  additionalField?: number | null;
  nickname?: string | null;
  img?: string | null;
  experience?: number | null;
  bio?: string | null;
  internalUser?: Pick<IUser, 'id' | 'login'> | null;
  level?: Pick<ILevel, 'id' | 'name'> | null;
}

export type NewApplicationUser = Omit<IApplicationUser, 'id'> & { id: null };
