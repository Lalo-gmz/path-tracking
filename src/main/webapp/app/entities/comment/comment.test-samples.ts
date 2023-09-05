import { IComment, NewComment } from './comment.model';

export const sampleWithRequiredData: IComment = {
  id: 78899,
  content: 'Coordinador',
};

export const sampleWithPartialData: IComment = {
  id: 78272,
  content: 'Andalucía Global',
};

export const sampleWithFullData: IComment = {
  id: 42730,
  content: 'disintermediate',
};

export const sampleWithNewData: NewComment = {
  content: 'deposit Ensalada Investment',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
