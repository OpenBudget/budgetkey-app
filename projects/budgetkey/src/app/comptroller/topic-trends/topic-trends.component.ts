import { Component, Input, OnChanges } from '@angular/core';
import { Axis, Comptroller, Pattern, Trend } from '../comptroller-dash.service';
import { AXES, pct, sitePath, surname } from '../dash-utils';

interface Bar {
  comptroller: string;
  share: number;
  height: number;
  peak: boolean;
  labelled: boolean;
  tooltip: string;
}

interface Row {
  trend: Trend;
  path: string;
  bars: Bar[];
  note: string;
  stats: string;
}

interface Group {
  pattern: Pattern;
  title: string;
  rows: Row[];
}

const GROUPS: {pattern: Pattern, title: string}[] = [
  {pattern: 'comptroller', title: 'עולים ויורדים עם המבקר'},
  {pattern: 'rising', title: 'עולים לאורך השנים'},
  {pattern: 'falling', title: 'יורדים לאורך השנים'},
  {pattern: 'stable', title: 'יציבים'},
];

const BAR_HEIGHT = 44;

// Each topic's share of the chapters under each comptroller, grouped by the kind of change
@Component({
  selector: 'app-topic-trends',
  templateUrl: './topic-trends.component.html',
  styleUrls: ['./topic-trends.component.less'],
  standalone: false
})
export class TopicTrendsComponent implements OnChanges {
  @Input() trends: Trend[] = [];
  @Input() comptrollers: Comptroller[] = [];
  @Input() download?: string;

  pct = pct;
  axes = AXES;
  axis: Axis = 'lens';
  groups: Group[] = [];
  // The comptrollers as column heads, with the years their column covers (the data starts in 2000)
  heads: {name: string, years: string}[] = [];

  ngOnChanges() {
    this.heads = this.comptrollers.map((c) => ({name: surname(c), years: `${c.first_year}–${c.last_year}`}));
    this.update();
  }

  setAxis(axis: Axis) {
    this.axis = axis;
    this.update();
  }

  private update() {
    const trends = this.trends.filter((t) => t.axis === this.axis);
    // One scale for all the rows, so that a small topic looks small
    const max = Math.max(...trends.flatMap((t) => Object.values(t.share_by_comptroller)), 0.0001);
    const names = new Map(this.comptrollers.map((c) => [c.comptroller, surname(c)]));
    const first = this.comptrollers[0]?.comptroller;
    const last = this.comptrollers[this.comptrollers.length - 1]?.comptroller;
    const rows = trends.map((t): Row => {
      // A trend is read from its first and last columns; a comptroller effect from its highest and lowest
      const byEnds = t.pattern === 'rising' || t.pattern === 'falling' || t.pattern === 'stable';
      const labelled = byEnds ? [first, last] : [t.peak_comptroller, t.low_comptroller];
      return {
        trend: t,
        path: sitePath(t.search_url),
        bars: this.comptrollers.map((c) => {
          const share = t.share_by_comptroller[c.comptroller] || 0;
          return {
            comptroller: c.comptroller,
            share,
            height: Math.max(2, Math.round(share / max * BAR_HEIGHT)),
            peak: t.peak_comptroller === c.comptroller,
            labelled: labelled.includes(c.comptroller),
            tooltip: `${t.label}, בתקופת ${surname(c)}: ${pct(share)} מהפרקים`,
          };
        }),
        note: this.note(t, names, first, last),
        stats: `יחס סיכויים לעשור: ${t.odds_ratio_per_decade.toFixed(2)} (p=${t.p_trend.toPrecision(2)}), ` +
               `השפעת המבקר: p=${t.p_comptroller.toPrecision(2)}`,
      };
    });
    this.groups = GROUPS
      .map((g) => ({...g, rows: rows.filter((r) => r.trend.pattern === g.pattern)}))
      .filter((g) => g.rows.length > 0);
  }

  private note(t: Trend, names: Map<string, string>, first: string, last: string): string {
    const from = pct(t.share_by_comptroller[first]);
    const to = pct(t.share_by_comptroller[last]);
    switch (t.pattern) {
      case 'comptroller':
        return `הכי הרבה אצל ${names.get(t.peak_comptroller)}, הכי מעט אצל ${names.get(t.low_comptroller)}`;
      case 'rising':
        return `עלה מ-${from} ל-${to}`;
      case 'falling':
        return `ירד מ-${from} ל-${to}`;
      default:
        return '';
    }
  }
}
