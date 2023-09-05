import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ILearningPath } from 'app/entities/learning-path/learning-path.model';

export interface IHeart {
  id: number;
  applicationUser?: Pick<IApplicationUser, 'id'> | null;
  learningPath?: Pick<ILearningPath, 'id' | 'name'> | null;
}

export type NewHeart = Omit<IHeart, 'id'> & { id: null };
