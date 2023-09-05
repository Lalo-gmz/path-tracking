import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { HeartFormService, HeartFormGroup } from './heart-form.service';
import { IHeart } from '../heart.model';
import { HeartService } from '../service/heart.service';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';
import { ILearningPath } from 'app/entities/learning-path/learning-path.model';
import { LearningPathService } from 'app/entities/learning-path/service/learning-path.service';

@Component({
  selector: 'jhi-heart-update',
  templateUrl: './heart-update.component.html',
})
export class HeartUpdateComponent implements OnInit {
  isSaving = false;
  heart: IHeart | null = null;

  applicationUsersSharedCollection: IApplicationUser[] = [];
  learningPathsSharedCollection: ILearningPath[] = [];

  editForm: HeartFormGroup = this.heartFormService.createHeartFormGroup();

  constructor(
    protected heartService: HeartService,
    protected heartFormService: HeartFormService,
    protected applicationUserService: ApplicationUserService,
    protected learningPathService: LearningPathService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareApplicationUser = (o1: IApplicationUser | null, o2: IApplicationUser | null): boolean =>
    this.applicationUserService.compareApplicationUser(o1, o2);

  compareLearningPath = (o1: ILearningPath | null, o2: ILearningPath | null): boolean =>
    this.learningPathService.compareLearningPath(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ heart }) => {
      this.heart = heart;
      if (heart) {
        this.updateForm(heart);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const heart = this.heartFormService.getHeart(this.editForm);
    if (heart.id !== null) {
      this.subscribeToSaveResponse(this.heartService.update(heart));
    } else {
      this.subscribeToSaveResponse(this.heartService.create(heart));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHeart>>): void {
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

  protected updateForm(heart: IHeart): void {
    this.heart = heart;
    this.heartFormService.resetForm(this.editForm, heart);

    this.applicationUsersSharedCollection = this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(
      this.applicationUsersSharedCollection,
      heart.applicationUser
    );
    this.learningPathsSharedCollection = this.learningPathService.addLearningPathToCollectionIfMissing<ILearningPath>(
      this.learningPathsSharedCollection,
      heart.learningPath
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
            this.heart?.applicationUser
          )
        )
      )
      .subscribe((applicationUsers: IApplicationUser[]) => (this.applicationUsersSharedCollection = applicationUsers));

    this.learningPathService
      .query()
      .pipe(map((res: HttpResponse<ILearningPath[]>) => res.body ?? []))
      .pipe(
        map((learningPaths: ILearningPath[]) =>
          this.learningPathService.addLearningPathToCollectionIfMissing<ILearningPath>(learningPaths, this.heart?.learningPath)
        )
      )
      .subscribe((learningPaths: ILearningPath[]) => (this.learningPathsSharedCollection = learningPaths));
  }
}
