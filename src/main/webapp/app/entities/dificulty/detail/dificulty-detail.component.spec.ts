import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DificultyDetailComponent } from './dificulty-detail.component';

describe('Dificulty Management Detail Component', () => {
  let comp: DificultyDetailComponent;
  let fixture: ComponentFixture<DificultyDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DificultyDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ dificulty: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DificultyDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DificultyDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load dificulty on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.dificulty).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
