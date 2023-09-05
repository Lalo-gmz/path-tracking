import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ILearningPath } from 'app/entities/learning-path/learning-path.model';

export interface IComment {
  id: number;
  content?: string | null;
  applicationUser?: Pick<IApplicationUser, 'id'> | null;
  learningPath?: Pick<ILearningPath, 'id' | 'name'> | null;
}

export type NewComment = Omit<IComment, 'id'> & { id: null };
