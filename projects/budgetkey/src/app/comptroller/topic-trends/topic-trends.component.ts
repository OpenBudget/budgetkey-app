import { Component, Input, OnChanges } from '@angular/core';
import { Axis, Comptroller, Pattern, Trend } from '../comptroller-dash.service';
import { pct, sitePath, surname } from '../dash-utils';

interface Bar {
  comptroller: string;
  share: number;
  height: number;
  peak: boolean;
  low: boolean;
  tooltip: string;
}

interface Row {
  trend: Trend;
  path: string;
  bars: Bar[];
  note: string;
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
  axis: Axis = 'lens';
  groups: Group[] = [];
  names: string[] = [];

  ngOnChanges() {
    this.names = this.comptrollers.map(surname);
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
    const rows = trends.map((t): Row => ({
      trend: t,
      path: sitePath(t.search_url),
      bars: this.comptrollers.map((c) => {
        const share = t.share_by_comptroller[c.comptroller] || 0;
        return {
          comptroller: c.comptroller,
          share,
          height: Math.max(2, Math.round(share / max * BAR_HEIGHT)),
          peak: t.peak_comptroller === c.comptroller,
          low: t.low_comptroller === c.comptroller,
          tooltip: `${t.label}, בתקופת ${surname(c)}: ${pct(share)} מהפרקים`,
        };
      }),
      note: this.note(t, names),
    }));
    this.groups = GROUPS
      .map((g) => ({...g, rows: rows.filter((r) => r.trend.pattern === g.pattern)}))
      .filter((g) => g.rows.length > 0);
  }

  private note(t: Trend, names: Map<string, string>): string {
    switch (t.pattern) {
      case 'comptroller':
        return `הכי הרבה אצל ${names.get(t.peak_comptroller)}, הכי מעט אצל ${names.get(t.low_comptroller)}`;
      case 'rising':
        return `גדל פי ${t.odds_ratio_per_decade.toFixed(1)} בכל עשור`;
      case 'falling':
        return `קטן פי ${(1 / t.odds_ratio_per_decade).toFixed(1)} בכל עשור`;
      default:
        return '';
    }
  }
}
