import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TaskFormService } from './task-form.service';
import { TaskService } from '../service/task.service';
import { ITask } from '../task.model';
import { IDificulty } from 'app/entities/dificulty/dificulty.model';
import { DificultyService } from 'app/entities/dificulty/service/dificulty.service';
import { ILearningPath } from 'app/entities/learning-path/learning-path.model';
import { LearningPathService } from 'app/entities/learning-path/service/learning-path.service';
import { IStatus } from 'app/entities/status/status.model';
import { StatusService } from 'app/entities/status/service/status.service';

import { TaskUpdateComponent } from './task-update.component';

describe('Task Management Update Component', () => {
  let comp: TaskUpdateComponent;
  let fixture: ComponentFixture<TaskUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let taskFormService: TaskFormService;
  let taskService: TaskService;
  let dificultyService: DificultyService;
  let learningPathService: LearningPathService;
  let statusService: StatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TaskUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TaskUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TaskUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    taskFormService = TestBed.inject(TaskFormService);
    taskService = TestBed.inject(TaskService);
    dificultyService = TestBed.inject(DificultyService);
    learningPathService = TestBed.inject(LearningPathService);
    statusService = TestBed.inject(StatusService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Dificulty query and add missing value', () => {
      const task: ITask = { id: 456 };
      const dificulties: IDificulty = { id: 9119 };
      task.dificulties = dificulties;

      const dificultyCollection: IDificulty[] = [{ id: 82500 }];
      jest.spyOn(dificultyService, 'query').mockReturnValue(of(new HttpResponse({ body: dificultyCollection })));
      const additionalDificulties = [dificulties];
      const expectedCollection: IDificulty[] = [...additionalDificulties, ...dificultyCollection];
      jest.spyOn(dificultyService, 'addDificultyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ task });
      comp.ngOnInit();

      expect(dificultyService.query).toHaveBeenCalled();
      expect(dificultyService.addDificultyToCollectionIfMissing).toHaveBeenCalledWith(
        dificultyCollection,
        ...additionalDificulties.map(expect.objectContaining)
      );
      expect(comp.dificultiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call LearningPath query and add missing value', () => {
      const task: ITask = { id: 456 };
      const learningPath: ILearningPath = { id: 7730 };
      task.learningPath = learningPath;

      const learningPathCollection: ILearningPath[] = [{ id: 6490 }];
      jest.spyOn(learningPathService, 'query').mockReturnValue(of(new HttpResponse({ body: learningPathCollection })));
      const additionalLearningPaths = [learningPath];
      const expectedCollection: ILearningPath[] = [...additionalLearningPaths, ...learningPathCollection];
      jest.spyOn(learningPathService, 'addLearningPathToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ task });
      comp.ngOnInit();

      expect(learningPathService.query).toHaveBeenCalled();
      expect(learningPathService.addLearningPathToCollectionIfMissing).toHaveBeenCalledWith(
        learningPathCollection,
        ...additionalLearningPaths.map(expect.objectContaining)
      );
      expect(comp.learningPathsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Status query and add missing value', () => {
      const task: ITask = { id: 456 };
      const status: IStatus = { id: 60843 };
      task.status = status;

      const statusCollection: IStatus[] = [{ id: 36643 }];
      jest.spyOn(statusService, 'query').mockReturnValue(of(new HttpResponse({ body: statusCollection })));
      const additionalStatuses = [status];
      const expectedCollection: IStatus[] = [...additionalStatuses, ...statusCollection];
      jest.spyOn(statusService, 'addStatusToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ task });
      comp.ngOnInit();

      expect(statusService.query).toHaveBeenCalled();
      expect(statusService.addStatusToCollectionIfMissing).toHaveBeenCalledWith(
        statusCollection,
        ...additionalStatuses.map(expect.objectContaining)
      );
      expect(comp.statusesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const task: ITask = { id: 456 };
      const dificulties: IDificulty = { id: 96093 };
      task.dificulties = dificulties;
      const learningPath: ILearningPath = { id: 48684 };
      task.learningPath = learningPath;
      const status: IStatus = { id: 40896 };
      task.status = status;

      activatedRoute.data = of({ task });
      comp.ngOnInit();

      expect(comp.dificultiesSharedCollection).toContain(dificulties);
      expect(comp.learningPathsSharedCollection).toContain(learningPath);
      expect(comp.statusesSharedCollection).toContain(status);
      expect(comp.task).toEqual(task);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITask>>();
      const task = { id: 123 };
      jest.spyOn(taskFormService, 'getTask').mockReturnValue(task);
      jest.spyOn(taskService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ task });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: task }));
      saveSubject.complete();

      // THEN
      expect(taskFormService.getTask).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(taskService.update).toHaveBeenCalledWith(expect.objectContaining(task));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITask>>();
      const task = { id: 123 };
      jest.spyOn(taskFormService, 'getTask').mockReturnValue({ id: null });
      jest.spyOn(taskService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ task: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: task }));
      saveSubject.complete();

      // THEN
      expect(taskFormService.getTask).toHaveBeenCalled();
      expect(taskService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITask>>();
      const task = { id: 123 };
      jest.spyOn(taskService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ task });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(taskService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDificulty', () => {
      it('Should forward to dificultyService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(dificultyService, 'compareDificulty');
        comp.compareDificulty(entity, entity2);
        expect(dificultyService.compareDificulty).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareLearningPath', () => {
      it('Should forward to learningPathService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(learningPathService, 'compareLearningPath');
        comp.compareLearningPath(entity, entity2);
        expect(learningPathService.compareLearningPath).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareStatus', () => {
      it('Should forward to statusService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(statusService, 'compareStatus');
        comp.compareStatus(entity, entity2);
        expect(statusService.compareStatus).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
