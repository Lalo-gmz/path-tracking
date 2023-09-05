import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDificulty } from '../dificulty.model';
import { DificultyService } from '../service/dificulty.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './dificulty-delete-dialog.component.html',
})
export class DificultyDeleteDialogComponent {
  dificulty?: IDificulty;

  constructor(protected dificultyService: DificultyService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.dificultyService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
