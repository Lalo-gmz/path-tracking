import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILearningPath } from '../learning-path.model';
import { LearningPathService } from '../service/learning-path.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './learning-path-delete-dialog.component.html',
})
export class LearningPathDeleteDialogComponent {
  learningPath?: ILearningPath;

  constructor(protected learningPathService: LearningPathService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.learningPathService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
