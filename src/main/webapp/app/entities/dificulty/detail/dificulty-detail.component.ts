import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDificulty } from '../dificulty.model';

@Component({
  selector: 'jhi-dificulty-detail',
  templateUrl: './dificulty-detail.component.html',
})
export class DificultyDetailComponent implements OnInit {
  dificulty: IDificulty | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dificulty }) => {
      this.dificulty = dificulty;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
