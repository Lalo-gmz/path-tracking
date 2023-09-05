import { IDificulty } from 'app/entities/dificulty/dificulty.model';
import { ILearningPath } from 'app/entities/learning-path/learning-path.model';
import { IStatus } from 'app/entities/status/status.model';

export interface ITask {
  id: number;
  name?: string | null;
  description?: string | null;
  experience?: number | null;
  dificulties?: Pick<IDificulty, 'id' | 'name'> | null;
  learningPath?: Pick<ILearningPath, 'id' | 'name'> | null;
  status?: Pick<IStatus, 'id' | 'name'> | null;
}

export type NewTask = Omit<ITask, 'id'> & { id: null };
