import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILevel, NewLevel } from '../level.model';

export type PartialUpdateLevel = Partial<ILevel> & Pick<ILevel, 'id'>;

export type EntityResponseType = HttpResponse<ILevel>;
export type EntityArrayResponseType = HttpResponse<ILevel[]>;

@Injectable({ providedIn: 'root' })
export class LevelService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/levels');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(level: NewLevel): Observable<EntityResponseType> {
    return this.http.post<ILevel>(this.resourceUrl, level, { observe: 'response' });
  }

  update(level: ILevel): Observable<EntityResponseType> {
    return this.http.put<ILevel>(`${this.resourceUrl}/${this.getLevelIdentifier(level)}`, level, { observe: 'response' });
  }

  partialUpdate(level: PartialUpdateLevel): Observable<EntityResponseType> {
    return this.http.patch<ILevel>(`${this.resourceUrl}/${this.getLevelIdentifier(level)}`, level, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILevel>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILevel[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLevelIdentifier(level: Pick<ILevel, 'id'>): number {
    return level.id;
  }

  compareLevel(o1: Pick<ILevel, 'id'> | null, o2: Pick<ILevel, 'id'> | null): boolean {
    return o1 && o2 ? this.getLevelIdentifier(o1) === this.getLevelIdentifier(o2) : o1 === o2;
  }

  addLevelToCollectionIfMissing<Type extends Pick<ILevel, 'id'>>(
    levelCollection: Type[],
    ...levelsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const levels: Type[] = levelsToCheck.filter(isPresent);
    if (levels.length > 0) {
      const levelCollectionIdentifiers = levelCollection.map(levelItem => this.getLevelIdentifier(levelItem)!);
      const levelsToAdd = levels.filter(levelItem => {
        const levelIdentifier = this.getLevelIdentifier(levelItem);
        if (levelCollectionIdentifiers.includes(levelIdentifier)) {
          return false;
        }
        levelCollectionIdentifiers.push(levelIdentifier);
        return true;
      });
      return [...levelsToAdd, ...levelCollection];
    }
    return levelCollection;
  }
}
