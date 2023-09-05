import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TaskFormService, TaskFormGroup } from './task-form.service';
import { ITask } from '../task.model';
import { TaskService } from '../service/task.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IDificulty } from 'app/entities/dificulty/dificulty.model';
import { DificultyService } from 'app/entities/dificulty/service/dificulty.service';
import { ILearningPath } from 'app/entities/learning-path/learning-path.model';
import { LearningPathService } from 'app/entities/learning-path/service/learning-path.service';
import { IStatus } from 'app/entities/status/status.model';
import { StatusService } from 'app/entities/status/service/status.service';

@Component({
  selector: 'jhi-task-update',
  templateUrl: './task-update.component.html',
})
export class TaskUpdateComponent implements OnInit {
  isSaving = false;
  task: ITask | null = null;

  dificultiesSharedCollection: IDificulty[] = [];
  learningPathsSharedCollection: ILearningPath[] = [];
  statusesSharedCollection: IStatus[] = [];

  editForm: TaskFormGroup = this.taskFormService.createTaskFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected taskService: TaskService,
    protected taskFormService: TaskFormService,
    protected dificultyService: DificultyService,
    protected learningPathService: LearningPathService,
    protected statusService: StatusService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDificulty = (o1: IDificulty | null, o2: IDificulty | null): boolean => this.dificultyService.compareDificulty(o1, o2);

  compareLearningPath = (o1: ILearningPath | null, o2: ILearningPath | null): boolean =>
    this.learningPathService.compareLearningPath(o1, o2);

  compareStatus = (o1: IStatus | null, o2: IStatus | null): boolean => this.statusService.compareStatus(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ task }) => {
      this.task = task;
      if (task) {
        this.updateForm(task);
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
    const task = this.taskFormService.getTask(this.editForm);
    if (task.id !== null) {
      this.subscribeToSaveResponse(this.taskService.update(task));
    } else {
      this.subscribeToSaveResponse(this.taskService.create(task));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITask>>): void {
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

  protected updateForm(task: ITask): void {
    this.task = task;
    this.taskFormService.resetForm(this.editForm, task);

    this.dificultiesSharedCollection = this.dificultyService.addDificultyToCollectionIfMissing<IDificulty>(
      this.dificultiesSharedCollection,
      task.dificulties
    );
    this.learningPathsSharedCollection = this.learningPathService.addLearningPathToCollectionIfMissing<ILearningPath>(
      this.learningPathsSharedCollection,
      task.learningPath
    );
    this.statusesSharedCollection = this.statusService.addStatusToCollectionIfMissing<IStatus>(this.statusesSharedCollection, task.status);
  }

  protected loadRelationshipsOptions(): void {
    this.dificultyService
      .query()
      .pipe(map((res: HttpResponse<IDificulty[]>) => res.body ?? []))
      .pipe(
        map((dificulties: IDificulty[]) =>
          this.dificultyService.addDificultyToCollectionIfMissing<IDificulty>(dificulties, this.task?.dificulties)
        )
      )
      .subscribe((dificulties: IDificulty[]) => (this.dificultiesSharedCollection = dificulties));

    this.learningPathService
      .query()
      .pipe(map((res: HttpResponse<ILearningPath[]>) => res.body ?? []))
      .pipe(
        map((learningPaths: ILearningPath[]) =>
          this.learningPathService.addLearningPathToCollectionIfMissing<ILearningPath>(learningPaths, this.task?.learningPath)
        )
      )
      .subscribe((learningPaths: ILearningPath[]) => (this.learningPathsSharedCollection = learningPaths));

    this.statusService
      .query()
      .pipe(map((res: HttpResponse<IStatus[]>) => res.body ?? []))
      .pipe(map((statuses: IStatus[]) => this.statusService.addStatusToCollectionIfMissing<IStatus>(statuses, this.task?.status)))
      .subscribe((statuses: IStatus[]) => (this.statusesSharedCollection = statuses));
  }
}
