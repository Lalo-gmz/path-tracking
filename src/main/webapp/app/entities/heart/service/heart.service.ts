import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHeart, NewHeart } from '../heart.model';

export type PartialUpdateHeart = Partial<IHeart> & Pick<IHeart, 'id'>;

export type EntityResponseType = HttpResponse<IHeart>;
export type EntityArrayResponseType = HttpResponse<IHeart[]>;

@Injectable({ providedIn: 'root' })
export class HeartService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/hearts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(heart: NewHeart): Observable<EntityResponseType> {
    return this.http.post<IHeart>(this.resourceUrl, heart, { observe: 'response' });
  }

  update(heart: IHeart): Observable<EntityResponseType> {
    return this.http.put<IHeart>(`${this.resourceUrl}/${this.getHeartIdentifier(heart)}`, heart, { observe: 'response' });
  }

  partialUpdate(heart: PartialUpdateHeart): Observable<EntityResponseType> {
    return this.http.patch<IHeart>(`${this.resourceUrl}/${this.getHeartIdentifier(heart)}`, heart, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IHeart>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IHeart[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getHeartIdentifier(heart: Pick<IHeart, 'id'>): number {
    return heart.id;
  }

  compareHeart(o1: Pick<IHeart, 'id'> | null, o2: Pick<IHeart, 'id'> | null): boolean {
    return o1 && o2 ? this.getHeartIdentifier(o1) === this.getHeartIdentifier(o2) : o1 === o2;
  }

  addHeartToCollectionIfMissing<Type extends Pick<IHeart, 'id'>>(
    heartCollection: Type[],
    ...heartsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const hearts: Type[] = heartsToCheck.filter(isPresent);
    if (hearts.length > 0) {
      const heartCollectionIdentifiers = heartCollection.map(heartItem => this.getHeartIdentifier(heartItem)!);
      const heartsToAdd = hearts.filter(heartItem => {
        const heartIdentifier = this.getHeartIdentifier(heartItem);
        if (heartCollectionIdentifiers.includes(heartIdentifier)) {
          return false;
        }
        heartCollectionIdentifiers.push(heartIdentifier);
        return true;
      });
      return [...heartsToAdd, ...heartCollection];
    }
    return heartCollection;
  }
}
