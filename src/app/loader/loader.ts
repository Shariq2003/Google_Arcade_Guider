// src/app/loader/loader.ts
import { Component, OnDestroy } from '@angular/core';
import { LoaderService } from '../services/loader/loader';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.html',
  styleUrls: ['./loader.scss'],
})
export class Loader implements OnDestroy {
  loading = false;
  private sub: Subscription;

  constructor(private loader: LoaderService) {
    this.sub = this.loader.loading$.subscribe((v) => (this.loading = v));
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
