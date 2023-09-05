import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHeart } from '../heart.model';

@Component({
  selector: 'jhi-heart-detail',
  templateUrl: './heart-detail.component.html',
})
export class HeartDetailComponent implements OnInit {
  heart: IHeart | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ heart }) => {
      this.heart = heart;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
