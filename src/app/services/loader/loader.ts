import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private _counter = 0;
  private _loading$ = new BehaviorSubject<boolean>(false);
  get loading$() {
    return this._loading$.asObservable();
  }

  show() {
    console.log('LoaderService: show');
    this._counter++;
    if (this._counter > 0) this._loading$.next(true);
  }

  hide() {
    this._counter = Math.max(0, this._counter - 1);
    if (this._counter === 0) this._loading$.next(false);
  }

  reset() {
    this._counter = 0;
    this._loading$.next(false);
  }
}
