import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HeartFormService } from './heart-form.service';
import { HeartService } from '../service/heart.service';
import { IHeart } from '../heart.model';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';
import { ILearningPath } from 'app/entities/learning-path/learning-path.model';
import { LearningPathService } from 'app/entities/learning-path/service/learning-path.service';

import { HeartUpdateComponent } from './heart-update.component';

describe('Heart Management Update Component', () => {
  let comp: HeartUpdateComponent;
  let fixture: ComponentFixture<HeartUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let heartFormService: HeartFormService;
  let heartService: HeartService;
  let applicationUserService: ApplicationUserService;
  let learningPathService: LearningPathService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [HeartUpdateComponent],
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
      .overrideTemplate(HeartUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HeartUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    heartFormService = TestBed.inject(HeartFormService);
    heartService = TestBed.inject(HeartService);
    applicationUserService = TestBed.inject(ApplicationUserService);
    learningPathService = TestBed.inject(LearningPathService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ApplicationUser query and add missing value', () => {
      const heart: IHeart = { id: 456 };
      const applicationUser: IApplicationUser = { id: 35536 };
      heart.applicationUser = applicationUser;

      const applicationUserCollection: IApplicationUser[] = [{ id: 46202 }];
      jest.spyOn(applicationUserService, 'query').mockReturnValue(of(new HttpResponse({ body: applicationUserCollection })));
      const additionalApplicationUsers = [applicationUser];
      const expectedCollection: IApplicationUser[] = [...additionalApplicationUsers, ...applicationUserCollection];
      jest.spyOn(applicationUserService, 'addApplicationUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ heart });
      comp.ngOnInit();

      expect(applicationUserService.query).toHaveBeenCalled();
      expect(applicationUserService.addApplicationUserToCollectionIfMissing).toHaveBeenCalledWith(
        applicationUserCollection,
        ...additionalApplicationUsers.map(expect.objectContaining)
      );
      expect(comp.applicationUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call LearningPath query and add missing value', () => {
      const heart: IHeart = { id: 456 };
      const learningPath: ILearningPath = { id: 41915 };
      heart.learningPath = learningPath;

      const learningPathCollection: ILearningPath[] = [{ id: 53429 }];
      jest.spyOn(learningPathService, 'query').mockReturnValue(of(new HttpResponse({ body: learningPathCollection })));
      const additionalLearningPaths = [learningPath];
      const expectedCollection: ILearningPath[] = [...additionalLearningPaths, ...learningPathCollection];
      jest.spyOn(learningPathService, 'addLearningPathToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ heart });
      comp.ngOnInit();

      expect(learningPathService.query).toHaveBeenCalled();
      expect(learningPathService.addLearningPathToCollectionIfMissing).toHaveBeenCalledWith(
        learningPathCollection,
        ...additionalLearningPaths.map(expect.objectContaining)
      );
      expect(comp.learningPathsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const heart: IHeart = { id: 456 };
      const applicationUser: IApplicationUser = { id: 40698 };
      heart.applicationUser = applicationUser;
      const learningPath: ILearningPath = { id: 89376 };
      heart.learningPath = learningPath;

      activatedRoute.data = of({ heart });
      comp.ngOnInit();

      expect(comp.applicationUsersSharedCollection).toContain(applicationUser);
      expect(comp.learningPathsSharedCollection).toContain(learningPath);
      expect(comp.heart).toEqual(heart);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHeart>>();
      const heart = { id: 123 };
      jest.spyOn(heartFormService, 'getHeart').mockReturnValue(heart);
      jest.spyOn(heartService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ heart });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: heart }));
      saveSubject.complete();

      // THEN
      expect(heartFormService.getHeart).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(heartService.update).toHaveBeenCalledWith(expect.objectContaining(heart));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHeart>>();
      const heart = { id: 123 };
      jest.spyOn(heartFormService, 'getHeart').mockReturnValue({ id: null });
      jest.spyOn(heartService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ heart: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: heart }));
      saveSubject.complete();

      // THEN
      expect(heartFormService.getHeart).toHaveBeenCalled();
      expect(heartService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHeart>>();
      const heart = { id: 123 };
      jest.spyOn(heartService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ heart });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(heartService.update).toHaveBeenCalled();
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

    describe('compareLearningPath', () => {
      it('Should forward to learningPathService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(learningPathService, 'compareLearningPath');
        comp.compareLearningPath(entity, entity2);
        expect(learningPathService.compareLearningPath).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
