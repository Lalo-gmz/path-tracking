import { IApplicationUser } from 'app/entities/application-user/application-user.model';

export interface ILearningPath {
  id: number;
  name?: string | null;
  description?: string | null;
  applicationUser?: Pick<IApplicationUser, 'id'> | null;
  createdBy?: Pick<IApplicationUser, 'id'> | null;
}

export type NewLearningPath = Omit<ILearningPath, 'id'> & { id: null };
