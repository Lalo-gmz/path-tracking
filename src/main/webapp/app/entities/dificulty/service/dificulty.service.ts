import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDificulty, NewDificulty } from '../dificulty.model';

export type PartialUpdateDificulty = Partial<IDificulty> & Pick<IDificulty, 'id'>;

export type EntityResponseType = HttpResponse<IDificulty>;
export type EntityArrayResponseType = HttpResponse<IDificulty[]>;

@Injectable({ providedIn: 'root' })
export class DificultyService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/dificulties');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(dificulty: NewDificulty): Observable<EntityResponseType> {
    return this.http.post<IDificulty>(this.resourceUrl, dificulty, { observe: 'response' });
  }

  update(dificulty: IDificulty): Observable<EntityResponseType> {
    return this.http.put<IDificulty>(`${this.resourceUrl}/${this.getDificultyIdentifier(dificulty)}`, dificulty, { observe: 'response' });
  }

  partialUpdate(dificulty: PartialUpdateDificulty): Observable<EntityResponseType> {
    return this.http.patch<IDificulty>(`${this.resourceUrl}/${this.getDificultyIdentifier(dificulty)}`, dificulty, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDificulty>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDificulty[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDificultyIdentifier(dificulty: Pick<IDificulty, 'id'>): number {
    return dificulty.id;
  }

  compareDificulty(o1: Pick<IDificulty, 'id'> | null, o2: Pick<IDificulty, 'id'> | null): boolean {
    return o1 && o2 ? this.getDificultyIdentifier(o1) === this.getDificultyIdentifier(o2) : o1 === o2;
  }

  addDificultyToCollectionIfMissing<Type extends Pick<IDificulty, 'id'>>(
    dificultyCollection: Type[],
    ...dificultiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const dificulties: Type[] = dificultiesToCheck.filter(isPresent);
    if (dificulties.length > 0) {
      const dificultyCollectionIdentifiers = dificultyCollection.map(dificultyItem => this.getDificultyIdentifier(dificultyItem)!);
      const dificultiesToAdd = dificulties.filter(dificultyItem => {
        const dificultyIdentifier = this.getDificultyIdentifier(dificultyItem);
        if (dificultyCollectionIdentifiers.includes(dificultyIdentifier)) {
          return false;
        }
        dificultyCollectionIdentifiers.push(dificultyIdentifier);
        return true;
      });
      return [...dificultiesToAdd, ...dificultyCollection];
    }
    return dificultyCollection;
  }
}
