import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHeart } from '../heart.model';
import { HeartService } from '../service/heart.service';

@Injectable({ providedIn: 'root' })
export class HeartRoutingResolveService implements Resolve<IHeart | null> {
  constructor(protected service: HeartService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHeart | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((heart: HttpResponse<IHeart>) => {
          if (heart.body) {
            return of(heart.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
