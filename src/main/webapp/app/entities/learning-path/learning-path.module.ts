import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LearningPathComponent } from './list/learning-path.component';
import { LearningPathDetailComponent } from './detail/learning-path-detail.component';
import { LearningPathUpdateComponent } from './update/learning-path-update.component';
import { LearningPathDeleteDialogComponent } from './delete/learning-path-delete-dialog.component';
import { LearningPathRoutingModule } from './route/learning-path-routing.module';

@NgModule({
  imports: [SharedModule, LearningPathRoutingModule],
  declarations: [LearningPathComponent, LearningPathDetailComponent, LearningPathUpdateComponent, LearningPathDeleteDialogComponent],
})
export class LearningPathModule {}
