import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HeartComponent } from './list/heart.component';
import { HeartDetailComponent } from './detail/heart-detail.component';
import { HeartUpdateComponent } from './update/heart-update.component';
import { HeartDeleteDialogComponent } from './delete/heart-delete-dialog.component';
import { HeartRoutingModule } from './route/heart-routing.module';

@NgModule({
  imports: [SharedModule, HeartRoutingModule],
  declarations: [HeartComponent, HeartDetailComponent, HeartUpdateComponent, HeartDeleteDialogComponent],
})
export class HeartModule {}
