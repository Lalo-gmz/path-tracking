import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../dificulty.test-samples';

import { DificultyFormService } from './dificulty-form.service';

describe('Dificulty Form Service', () => {
  let service: DificultyFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DificultyFormService);
  });

  describe('Service methods', () => {
    describe('createDificultyFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDificultyFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            points: expect.any(Object),
          })
        );
      });

      it('passing IDificulty should create a new form with FormGroup', () => {
        const formGroup = service.createDificultyFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            points: expect.any(Object),
          })
        );
      });
    });

    describe('getDificulty', () => {
      it('should return NewDificulty for default Dificulty initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDificultyFormGroup(sampleWithNewData);

        const dificulty = service.getDificulty(formGroup) as any;

        expect(dificulty).toMatchObject(sampleWithNewData);
      });

      it('should return NewDificulty for empty Dificulty initial value', () => {
        const formGroup = service.createDificultyFormGroup();

        const dificulty = service.getDificulty(formGroup) as any;

        expect(dificulty).toMatchObject({});
      });

      it('should return IDificulty', () => {
        const formGroup = service.createDificultyFormGroup(sampleWithRequiredData);

        const dificulty = service.getDificulty(formGroup) as any;

        expect(dificulty).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDificulty should not enable id FormControl', () => {
        const formGroup = service.createDificultyFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDificulty should disable id FormControl', () => {
        const formGroup = service.createDificultyFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
