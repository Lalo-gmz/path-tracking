import { IHeart, NewHeart } from './heart.model';

export const sampleWithRequiredData: IHeart = {
  id: 70661,
};

export const sampleWithPartialData: IHeart = {
  id: 25623,
};

export const sampleWithFullData: IHeart = {
  id: 94978,
};

export const sampleWithNewData: NewHeart = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
