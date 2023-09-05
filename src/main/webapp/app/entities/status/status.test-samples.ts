import { IStatus, NewStatus } from './status.model';

export const sampleWithRequiredData: IStatus = {
  id: 34266,
  name: 'tangible Soporte',
};

export const sampleWithPartialData: IStatus = {
  id: 38154,
  name: 'Planificador',
  order: 65633,
};

export const sampleWithFullData: IStatus = {
  id: 96443,
  name: 'Agente Vía out-of-the-box',
  order: 87639,
};

export const sampleWithNewData: NewStatus = {
  name: 'transmitting Kenia Hormigon',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
