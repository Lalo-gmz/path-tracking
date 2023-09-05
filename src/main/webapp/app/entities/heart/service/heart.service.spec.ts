import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IHeart } from '../heart.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../heart.test-samples';

import { HeartService } from './heart.service';

const requireRestSample: IHeart = {
  ...sampleWithRequiredData,
};

describe('Heart Service', () => {
  let service: HeartService;
  let httpMock: HttpTestingController;
  let expectedResult: IHeart | IHeart[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(HeartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Heart', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const heart = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(heart).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Heart', () => {
      const heart = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(heart).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Heart', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Heart', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Heart', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addHeartToCollectionIfMissing', () => {
      it('should add a Heart to an empty array', () => {
        const heart: IHeart = sampleWithRequiredData;
        expectedResult = service.addHeartToCollectionIfMissing([], heart);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(heart);
      });

      it('should not add a Heart to an array that contains it', () => {
        const heart: IHeart = sampleWithRequiredData;
        const heartCollection: IHeart[] = [
          {
            ...heart,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addHeartToCollectionIfMissing(heartCollection, heart);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Heart to an array that doesn't contain it", () => {
        const heart: IHeart = sampleWithRequiredData;
        const heartCollection: IHeart[] = [sampleWithPartialData];
        expectedResult = service.addHeartToCollectionIfMissing(heartCollection, heart);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(heart);
      });

      it('should add only unique Heart to an array', () => {
        const heartArray: IHeart[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const heartCollection: IHeart[] = [sampleWithRequiredData];
        expectedResult = service.addHeartToCollectionIfMissing(heartCollection, ...heartArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const heart: IHeart = sampleWithRequiredData;
        const heart2: IHeart = sampleWithPartialData;
        expectedResult = service.addHeartToCollectionIfMissing([], heart, heart2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(heart);
        expect(expectedResult).toContain(heart2);
      });

      it('should accept null and undefined values', () => {
        const heart: IHeart = sampleWithRequiredData;
        expectedResult = service.addHeartToCollectionIfMissing([], null, heart, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(heart);
      });

      it('should return initial array if no Heart is added', () => {
        const heartCollection: IHeart[] = [sampleWithRequiredData];
        expectedResult = service.addHeartToCollectionIfMissing(heartCollection, undefined, null);
        expect(expectedResult).toEqual(heartCollection);
      });
    });

    describe('compareHeart', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareHeart(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareHeart(entity1, entity2);
        const compareResult2 = service.compareHeart(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareHeart(entity1, entity2);
        const compareResult2 = service.compareHeart(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareHeart(entity1, entity2);
        const compareResult2 = service.compareHeart(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
