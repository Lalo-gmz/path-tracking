import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: 37978,
  name: 'CSS Account Mejorado',
};

export const sampleWithPartialData: ITask = {
  id: 84034,
  name: 'Kwacha Granito TCP',
};

export const sampleWithFullData: ITask = {
  id: 16179,
  name: 'Director Interno',
  description: '../fake-data/blob/hipster.txt',
  experience: 66924,
};

export const sampleWithNewData: NewTask = {
  name: 'artificial Decoración Dirham',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
