import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IHeart, NewHeart } from '../heart.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IHeart for edit and NewHeartFormGroupInput for create.
 */
type HeartFormGroupInput = IHeart | PartialWithRequiredKeyOf<NewHeart>;

type HeartFormDefaults = Pick<NewHeart, 'id'>;

type HeartFormGroupContent = {
  id: FormControl<IHeart['id'] | NewHeart['id']>;
  applicationUser: FormControl<IHeart['applicationUser']>;
  learningPath: FormControl<IHeart['learningPath']>;
};

export type HeartFormGroup = FormGroup<HeartFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class HeartFormService {
  createHeartFormGroup(heart: HeartFormGroupInput = { id: null }): HeartFormGroup {
    const heartRawValue = {
      ...this.getFormDefaults(),
      ...heart,
    };
    return new FormGroup<HeartFormGroupContent>({
      id: new FormControl(
        { value: heartRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      applicationUser: new FormControl(heartRawValue.applicationUser),
      learningPath: new FormControl(heartRawValue.learningPath),
    });
  }

  getHeart(form: HeartFormGroup): IHeart | NewHeart {
    return form.getRawValue() as IHeart | NewHeart;
  }

  resetForm(form: HeartFormGroup, heart: HeartFormGroupInput): void {
    const heartRawValue = { ...this.getFormDefaults(), ...heart };
    form.reset(
      {
        ...heartRawValue,
        id: { value: heartRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): HeartFormDefaults {
    return {
      id: null,
    };
  }
}
