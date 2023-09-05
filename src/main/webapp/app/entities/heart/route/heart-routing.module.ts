import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HeartComponent } from '../list/heart.component';
import { HeartDetailComponent } from '../detail/heart-detail.component';
import { HeartUpdateComponent } from '../update/heart-update.component';
import { HeartRoutingResolveService } from './heart-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const heartRoute: Routes = [
  {
    path: '',
    component: HeartComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HeartDetailComponent,
    resolve: {
      heart: HeartRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HeartUpdateComponent,
    resolve: {
      heart: HeartRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HeartUpdateComponent,
    resolve: {
      heart: HeartRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(heartRoute)],
  exports: [RouterModule],
})
export class HeartRoutingModule {}
