import { ILevel, NewLevel } from './level.model';

export const sampleWithRequiredData: ILevel = {
  id: 21386,
  name: 'Madera',
};

export const sampleWithPartialData: ILevel = {
  id: 33124,
  name: 'quantify',
};

export const sampleWithFullData: ILevel = {
  id: 85493,
  name: 'Técnico',
  order: 25965,
  minExpe: 28434,
};

export const sampleWithNewData: NewLevel = {
  name: 'quantifying Planificador',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
