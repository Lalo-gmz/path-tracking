import { IDificulty, NewDificulty } from './dificulty.model';

export const sampleWithRequiredData: IDificulty = {
  id: 7823,
  name: 'multi-byte',
};

export const sampleWithPartialData: IDificulty = {
  id: 61278,
  name: 'de leverage',
  points: 96472,
};

export const sampleWithFullData: IDificulty = {
  id: 3143,
  name: 'array Brasil',
  points: 61666,
};

export const sampleWithNewData: NewDificulty = {
  name: 'explícita cliente JSON',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
