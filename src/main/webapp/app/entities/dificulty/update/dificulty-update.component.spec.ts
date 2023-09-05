import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DificultyFormService } from './dificulty-form.service';
import { DificultyService } from '../service/dificulty.service';
import { IDificulty } from '../dificulty.model';

import { DificultyUpdateComponent } from './dificulty-update.component';

describe('Dificulty Management Update Component', () => {
  let comp: DificultyUpdateComponent;
  let fixture: ComponentFixture<DificultyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let dificultyFormService: DificultyFormService;
  let dificultyService: DificultyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DificultyUpdateComponent],
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
      .overrideTemplate(DificultyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DificultyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    dificultyFormService = TestBed.inject(DificultyFormService);
    dificultyService = TestBed.inject(DificultyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const dificulty: IDificulty = { id: 456 };

      activatedRoute.data = of({ dificulty });
      comp.ngOnInit();

      expect(comp.dificulty).toEqual(dificulty);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDificulty>>();
      const dificulty = { id: 123 };
      jest.spyOn(dificultyFormService, 'getDificulty').mockReturnValue(dificulty);
      jest.spyOn(dificultyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dificulty });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: dificulty }));
      saveSubject.complete();

      // THEN
      expect(dificultyFormService.getDificulty).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(dificultyService.update).toHaveBeenCalledWith(expect.objectContaining(dificulty));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDificulty>>();
      const dificulty = { id: 123 };
      jest.spyOn(dificultyFormService, 'getDificulty').mockReturnValue({ id: null });
      jest.spyOn(dificultyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dificulty: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: dificulty }));
      saveSubject.complete();

      // THEN
      expect(dificultyFormService.getDificulty).toHaveBeenCalled();
      expect(dificultyService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDificulty>>();
      const dificulty = { id: 123 };
      jest.spyOn(dificultyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dificulty });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(dificultyService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
