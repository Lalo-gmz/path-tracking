import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LearningPathFormService } from './learning-path-form.service';
import { LearningPathService } from '../service/learning-path.service';
import { ILearningPath } from '../learning-path.model';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';

import { LearningPathUpdateComponent } from './learning-path-update.component';

describe('LearningPath Management Update Component', () => {
  let comp: LearningPathUpdateComponent;
  let fixture: ComponentFixture<LearningPathUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let learningPathFormService: LearningPathFormService;
  let learningPathService: LearningPathService;
  let applicationUserService: ApplicationUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LearningPathUpdateComponent],
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
      .overrideTemplate(LearningPathUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LearningPathUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    learningPathFormService = TestBed.inject(LearningPathFormService);
    learningPathService = TestBed.inject(LearningPathService);
    applicationUserService = TestBed.inject(ApplicationUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ApplicationUser query and add missing value', () => {
      const learningPath: ILearningPath = { id: 456 };
      const applicationUser: IApplicationUser = { id: 36724 };
      learningPath.applicationUser = applicationUser;
      const createdBy: IApplicationUser = { id: 42041 };
      learningPath.createdBy = createdBy;

      const applicationUserCollection: IApplicationUser[] = [{ id: 45679 }];
      jest.spyOn(applicationUserService, 'query').mockReturnValue(of(new HttpResponse({ body: applicationUserCollection })));
      const additionalApplicationUsers = [applicationUser, createdBy];
      const expectedCollection: IApplicationUser[] = [...additionalApplicationUsers, ...applicationUserCollection];
      jest.spyOn(applicationUserService, 'addApplicationUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ learningPath });
      comp.ngOnInit();

      expect(applicationUserService.query).toHaveBeenCalled();
      expect(applicationUserService.addApplicationUserToCollectionIfMissing).toHaveBeenCalledWith(
        applicationUserCollection,
        ...additionalApplicationUsers.map(expect.objectContaining)
      );
      expect(comp.applicationUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const learningPath: ILearningPath = { id: 456 };
      const applicationUser: IApplicationUser = { id: 28289 };
      learningPath.applicationUser = applicationUser;
      const createdBy: IApplicationUser = { id: 3789 };
      learningPath.createdBy = createdBy;

      activatedRoute.data = of({ learningPath });
      comp.ngOnInit();

      expect(comp.applicationUsersSharedCollection).toContain(applicationUser);
      expect(comp.applicationUsersSharedCollection).toContain(createdBy);
      expect(comp.learningPath).toEqual(learningPath);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILearningPath>>();
      const learningPath = { id: 123 };
      jest.spyOn(learningPathFormService, 'getLearningPath').mockReturnValue(learningPath);
      jest.spyOn(learningPathService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ learningPath });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: learningPath }));
      saveSubject.complete();

      // THEN
      expect(learningPathFormService.getLearningPath).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(learningPathService.update).toHaveBeenCalledWith(expect.objectContaining(learningPath));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILearningPath>>();
      const learningPath = { id: 123 };
      jest.spyOn(learningPathFormService, 'getLearningPath').mockReturnValue({ id: null });
      jest.spyOn(learningPathService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ learningPath: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: learningPath }));
      saveSubject.complete();

      // THEN
      expect(learningPathFormService.getLearningPath).toHaveBeenCalled();
      expect(learningPathService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILearningPath>>();
      const learningPath = { id: 123 };
      jest.spyOn(learningPathService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ learningPath });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(learningPathService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareApplicationUser', () => {
      it('Should forward to applicationUserService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(applicationUserService, 'compareApplicationUser');
        comp.compareApplicationUser(entity, entity2);
        expect(applicationUserService.compareApplicationUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
