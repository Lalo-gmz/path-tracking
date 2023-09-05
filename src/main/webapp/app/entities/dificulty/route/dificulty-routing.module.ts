import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DificultyComponent } from '../list/dificulty.component';
import { DificultyDetailComponent } from '../detail/dificulty-detail.component';
import { DificultyUpdateComponent } from '../update/dificulty-update.component';
import { DificultyRoutingResolveService } from './dificulty-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const dificultyRoute: Routes = [
  {
    path: '',
    component: DificultyComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DificultyDetailComponent,
    resolve: {
      dificulty: DificultyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DificultyUpdateComponent,
    resolve: {
      dificulty: DificultyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DificultyUpdateComponent,
    resolve: {
      dificulty: DificultyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(dificultyRoute)],
  exports: [RouterModule],
})
export class DificultyRoutingModule {}
