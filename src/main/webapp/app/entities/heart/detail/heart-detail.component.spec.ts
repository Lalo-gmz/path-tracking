import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HeartDetailComponent } from './heart-detail.component';

describe('Heart Management Detail Component', () => {
  let comp: HeartDetailComponent;
  let fixture: ComponentFixture<HeartDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeartDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ heart: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(HeartDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(HeartDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load heart on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.heart).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
