import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LearningPathComponent } from '../list/learning-path.component';
import { LearningPathDetailComponent } from '../detail/learning-path-detail.component';
import { LearningPathUpdateComponent } from '../update/learning-path-update.component';
import { LearningPathRoutingResolveService } from './learning-path-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const learningPathRoute: Routes = [
  {
    path: '',
    component: LearningPathComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LearningPathDetailComponent,
    resolve: {
      learningPath: LearningPathRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LearningPathUpdateComponent,
    resolve: {
      learningPath: LearningPathRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LearningPathUpdateComponent,
    resolve: {
      learningPath: LearningPathRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(learningPathRoute)],
  exports: [RouterModule],
})
export class LearningPathRoutingModule {}
