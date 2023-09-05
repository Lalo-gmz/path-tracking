import { IApplicationUser, NewApplicationUser } from './application-user.model';

export const sampleWithRequiredData: IApplicationUser = {
  id: 60827,
};

export const sampleWithPartialData: IApplicationUser = {
  id: 8058,
  nickname: 'neutral Coordinador',
  img: 'optical Moda',
  experience: 76206,
  bio: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IApplicationUser = {
  id: 78228,
  additionalField: 42,
  nickname: 'next-generation eyeballs Operativo',
  img: 'Representante',
  experience: 90491,
  bio: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewApplicationUser = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
