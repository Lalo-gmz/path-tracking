import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILearningPath } from '../learning-path.model';
import { LearningPathService } from '../service/learning-path.service';

@Injectable({ providedIn: 'root' })
export class LearningPathRoutingResolveService implements Resolve<ILearningPath | null> {
  constructor(protected service: LearningPathService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILearningPath | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((learningPath: HttpResponse<ILearningPath>) => {
          if (learningPath.body) {
            return of(learningPath.body);
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
