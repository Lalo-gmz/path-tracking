import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../heart.test-samples';

import { HeartFormService } from './heart-form.service';

describe('Heart Form Service', () => {
  let service: HeartFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeartFormService);
  });

  describe('Service methods', () => {
    describe('createHeartFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createHeartFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            applicationUser: expect.any(Object),
            learningPath: expect.any(Object),
          })
        );
      });

      it('passing IHeart should create a new form with FormGroup', () => {
        const formGroup = service.createHeartFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            applicationUser: expect.any(Object),
            learningPath: expect.any(Object),
          })
        );
      });
    });

    describe('getHeart', () => {
      it('should return NewHeart for default Heart initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createHeartFormGroup(sampleWithNewData);

        const heart = service.getHeart(formGroup) as any;

        expect(heart).toMatchObject(sampleWithNewData);
      });

      it('should return NewHeart for empty Heart initial value', () => {
        const formGroup = service.createHeartFormGroup();

        const heart = service.getHeart(formGroup) as any;

        expect(heart).toMatchObject({});
      });

      it('should return IHeart', () => {
        const formGroup = service.createHeartFormGroup(sampleWithRequiredData);

        const heart = service.getHeart(formGroup) as any;

        expect(heart).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IHeart should not enable id FormControl', () => {
        const formGroup = service.createHeartFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewHeart should disable id FormControl', () => {
        const formGroup = service.createHeartFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
