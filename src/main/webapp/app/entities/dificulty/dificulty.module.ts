import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DificultyComponent } from './list/dificulty.component';
import { DificultyDetailComponent } from './detail/dificulty-detail.component';
import { DificultyUpdateComponent } from './update/dificulty-update.component';
import { DificultyDeleteDialogComponent } from './delete/dificulty-delete-dialog.component';
import { DificultyRoutingModule } from './route/dificulty-routing.module';

@NgModule({
  imports: [SharedModule, DificultyRoutingModule],
  declarations: [DificultyComponent, DificultyDetailComponent, DificultyUpdateComponent, DificultyDeleteDialogComponent],
})
export class DificultyModule {}
