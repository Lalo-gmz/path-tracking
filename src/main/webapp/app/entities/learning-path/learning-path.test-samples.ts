import { ILearningPath, NewLearningPath } from './learning-path.model';

export const sampleWithRequiredData: ILearningPath = {
  id: 99714,
  name: 'Borders Plástico',
};

export const sampleWithPartialData: ILearningPath = {
  id: 54969,
  name: 'multi-byte compuesto Joyería',
};

export const sampleWithFullData: ILearningPath = {
  id: 21557,
  name: 'index Money Baleares',
  description: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewLearningPath = {
  name: 'navigate copying',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
