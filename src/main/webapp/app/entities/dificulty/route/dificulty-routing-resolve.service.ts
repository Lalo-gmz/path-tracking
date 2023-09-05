import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDificulty } from '../dificulty.model';
import { DificultyService } from '../service/dificulty.service';

@Injectable({ providedIn: 'root' })
export class DificultyRoutingResolveService implements Resolve<IDificulty | null> {
  constructor(protected service: DificultyService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDificulty | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((dificulty: HttpResponse<IDificulty>) => {
          if (dificulty.body) {
            return of(dificulty.body);
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
