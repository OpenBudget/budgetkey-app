import { Component, Input, OnChanges } from '@angular/core';
import { Comptroller, DashEvent } from '../comptroller-dash.service';
import { monthSpan, num, sitePath, termYears } from '../dash-utils';

interface Item {
  event: DashEvent;
  path: string;
  chapters: number[];
  // "38 פרקים ב-3 דוחות, 1,234 ממצאים": the squares' label and tooltip
  counts: string;
  // When the reports came out: "מרץ 1999", or from the first to the last
  published: string;
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

  terms: Term[] = [];

  ngOnChanges() {
    // Newest term first, like the events
    this.terms = [...this.comptrollers].reverse().map((c) => ({
      comptroller: c,
      years: termYears(c),
      items: this.events
        .filter((e) => e.last_published >= c.start_date && (!c.end_date || e.last_published <= c.end_date))
        .map((e) => ({
          event: e,
          path: sitePath(e.search_url),
          chapters: Array.from({length: e.n_chapters}, (_, i) => i),
          counts: (e.n_chapters === 1 ? 'פרק אחד' : `${num(e.n_chapters)} פרקים`) +
                  (e.n_reports > 1 ? ` ב-${e.n_reports} דוחות` : '') + `, ${num(e.n_findings)} ממצאים`,
          published: monthSpan(e.first_published, e.last_published),
        })),
    })).filter((t) => t.items.length > 0);
  }
}
