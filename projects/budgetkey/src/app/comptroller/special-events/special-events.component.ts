import { Component, Input, OnChanges } from '@angular/core';
import { Comptroller, DashEvent } from '../comptroller-dash.service';
import { num, sitePath, year } from '../dash-utils';

interface Item {
  event: DashEvent;
  path: string;
  chapters: number[];
}

interface Term {
  comptroller: Comptroller;
  years: string;
  items: Item[];
}

// The events the comptroller wrote special reports on, by comptroller.
// Each square is one audit chapter.
@Component({
  selector: 'app-special-events',
  templateUrl: './special-events.component.html',
  styleUrls: ['./special-events.component.less'],
  standalone: false
})
export class SpecialEventsComponent implements OnChanges {
  @Input() events: DashEvent[] = [];
  @Input() comptrollers: Comptroller[] = [];
  @Input() download?: string;

  num = num;
  terms: Term[] = [];

  ngOnChanges() {
    // Newest term first, like the events
    this.terms = [...this.comptrollers].reverse().map((c) => ({
      comptroller: c,
      years: `${year(c.start_date)}–${c.end_date ? year(c.end_date) : ''}`,
      items: this.events
        .filter((e) => e.last_published >= c.start_date && (!c.end_date || e.last_published <= c.end_date))
        .map((e) => ({event: e, path: sitePath(e.search_url), chapters: Array.from({length: e.n_chapters}, (_, i) => i)})),
    })).filter((t) => t.items.length > 0);
  }
}
