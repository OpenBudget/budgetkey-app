import { Injectable, signal } from '@angular/core';
import { WindowService } from './window.service';
import { fromEvent } from 'rxjs';

@Injectable()
export class LayoutService {

  width = signal<number>(0);

  constructor(private window: WindowService) {
    if (this.window._) {
      fromEvent(this.window._, 'resize').subscribe(() => {
        this.recalcWidth();
      });
      this.recalcWidth();
    }
  }

  recalcWidth() {
    this.width.set(this.window._?.innerWidth || 0);
  }

  get mobile() {
    return (this.window._?.innerWidth || 0) < 1000;
  }

  get desktop() {
    return (this.window._?.innerWidth || 0) >= 1000;
  }
}
