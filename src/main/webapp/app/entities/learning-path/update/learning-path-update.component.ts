import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LearningPathFormService, LearningPathFormGroup } from './learning-path-form.service';
import { ILearningPath } from '../learning-path.model';
import { LearningPathService } from '../service/learning-path.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';

@Component({
  selector: 'jhi-learning-path-update',
  templateUrl: './learning-path-update.component.html',
})
export class LearningPathUpdateComponent implements OnInit {
  isSaving = false;
  learningPath: ILearningPath | null = null;

  applicationUsersSharedCollection: IApplicationUser[] = [];

  editForm: LearningPathFormGroup = this.learningPathFormService.createLearningPathFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected learningPathService: LearningPathService,
    protected learningPathFormService: LearningPathFormService,
    protected applicationUserService: ApplicationUserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareApplicationUser = (o1: IApplicationUser | null, o2: IApplicationUser | null): boolean =>
    this.applicationUserService.compareApplicationUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ learningPath }) => {
      this.learningPath = learningPath;
      if (learningPath) {
        this.updateForm(learningPath);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('l2EApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const learningPath = this.learningPathFormService.getLearningPath(this.editForm);
    if (learningPath.id !== null) {
      this.subscribeToSaveResponse(this.learningPathService.update(learningPath));
    } else {
      this.subscribeToSaveResponse(this.learningPathService.create(learningPath));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILearningPath>>): void {
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

  protected updateForm(learningPath: ILearningPath): void {
    this.learningPath = learningPath;
    this.learningPathFormService.resetForm(this.editForm, learningPath);

    this.applicationUsersSharedCollection = this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(
      this.applicationUsersSharedCollection,
      learningPath.applicationUser,
      learningPath.createdBy
    );
  }

  protected loadRelationshipsOptions(): void {
    this.applicationUserService
      .query()
      .pipe(map((res: HttpResponse<IApplicationUser[]>) => res.body ?? []))
      .pipe(
        map((applicationUsers: IApplicationUser[]) =>
          this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(
            applicationUsers,
            this.learningPath?.applicationUser,
            this.learningPath?.createdBy
          )
        )
      )
      .subscribe((applicationUsers: IApplicationUser[]) => (this.applicationUsersSharedCollection = applicationUsers));
  }
}
