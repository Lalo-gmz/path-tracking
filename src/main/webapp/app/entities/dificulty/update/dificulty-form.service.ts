import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDificulty, NewDificulty } from '../dificulty.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDificulty for edit and NewDificultyFormGroupInput for create.
 */
type DificultyFormGroupInput = IDificulty | PartialWithRequiredKeyOf<NewDificulty>;

type DificultyFormDefaults = Pick<NewDificulty, 'id'>;

type DificultyFormGroupContent = {
  id: FormControl<IDificulty['id'] | NewDificulty['id']>;
  name: FormControl<IDificulty['name']>;
  points: FormControl<IDificulty['points']>;
};

export type DificultyFormGroup = FormGroup<DificultyFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DificultyFormService {
  createDificultyFormGroup(dificulty: DificultyFormGroupInput = { id: null }): DificultyFormGroup {
    const dificultyRawValue = {
      ...this.getFormDefaults(),
      ...dificulty,
    };
    return new FormGroup<DificultyFormGroupContent>({
      id: new FormControl(
        { value: dificultyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(dificultyRawValue.name, {
        validators: [Validators.required],
      }),
      points: new FormControl(dificultyRawValue.points),
    });
  }

  getDificulty(form: DificultyFormGroup): IDificulty | NewDificulty {
    return form.getRawValue() as IDificulty | NewDificulty;
  }

  resetForm(form: DificultyFormGroup, dificulty: DificultyFormGroupInput): void {
    const dificultyRawValue = { ...this.getFormDefaults(), ...dificulty };
    form.reset(
      {
        ...dificultyRawValue,
        id: { value: dificultyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DificultyFormDefaults {
    return {
      id: null,
    };
  }
}
