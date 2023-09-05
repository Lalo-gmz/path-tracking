import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { DificultyFormService, DificultyFormGroup } from './dificulty-form.service';
import { IDificulty } from '../dificulty.model';
import { DificultyService } from '../service/dificulty.service';

@Component({
  selector: 'jhi-dificulty-update',
  templateUrl: './dificulty-update.component.html',
})
export class DificultyUpdateComponent implements OnInit {
  isSaving = false;
  dificulty: IDificulty | null = null;

  editForm: DificultyFormGroup = this.dificultyFormService.createDificultyFormGroup();

  constructor(
    protected dificultyService: DificultyService,
    protected dificultyFormService: DificultyFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dificulty }) => {
      this.dificulty = dificulty;
      if (dificulty) {
        this.updateForm(dificulty);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const dificulty = this.dificultyFormService.getDificulty(this.editForm);
    if (dificulty.id !== null) {
      this.subscribeToSaveResponse(this.dificultyService.update(dificulty));
    } else {
      this.subscribeToSaveResponse(this.dificultyService.create(dificulty));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDificulty>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(dificulty: IDificulty): void {
    this.dificulty = dificulty;
    this.dificultyFormService.resetForm(this.editForm, dificulty);
  }
}
