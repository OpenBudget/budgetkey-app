import { Component, Input, OnChanges } from '@angular/core';
import { Axis, Comptroller, Count } from '../comptroller-dash.service';
import { num, pct, sitePath, surname } from '../dash-utils';

interface Word {
  key: string;
  label: string;
  path: string;
  // Relative size, 0 to 1; the stylesheet turns it into a font size for the screen width
  t: number;
  tone: 'up' | 'down' | 'plain';
  tooltip: string;
}

// Lift above which a topic "stood out" in a comptroller's term, and below which it was rarer than usual
const UP = 1.3;
const DOWN = 0.7;

// The topics as a word map: sized by how many chapters dealt with each,
// with the topics that stood out in the chosen comptroller's term highlighted
@Component({
  selector: 'app-topic-map',
  templateUrl: './topic-map.component.html',
  styleUrls: ['./topic-map.component.less'],
  standalone: false
})
export class TopicMapComponent implements OnChanges {
  @Input() counts: Count[] = [];
  @Input() comptrollers: Comptroller[] = [];
  @Input() download?: string;

  axis: Axis = 'domain';
  period = 'all';
  periods: {key: string, label: string}[] = [];
  words: Word[] = [];

  ngOnChanges() {
    this.periods = [
      {key: 'all', label: 'כל השנים'},
      ...this.comptrollers.map((c) => ({key: c.comptroller, label: surname(c)})),
    ];
    this.update();
  }

  setAxis(axis: Axis) {
    this.axis = axis;
    this.update();
  }

  setPeriod(period: string) {
    this.period = period;
    this.update();
  }

  private update() {
    const ofAxis = this.counts.filter((c) => c.axis === this.axis);
    // The words keep their places (by overall size) when the period changes; only their size and tone change
    const order = ofAxis.filter((c) => c.period_kind === 'all').sort((a, b) => b.n - a.n).map((c) => c.key);
    const inPeriod = new Map(ofAxis.filter((c) => c.period === this.period).map((c) => [c.key, c]));
    const maxShare = Math.max(...[...inPeriod.values()].map((c) => c.share), 0.0001);
    const periodLabel = this.period === 'all' ? 'מכל הפרקים' : `מהפרקים בתקופת ${this.periods.find((p) => p.key === this.period)?.label}`;
    this.words = order.filter((key) => inPeriod.has(key)).map((key) => {
      const c = inPeriod.get(key)!;
      const tone = this.period === 'all' ? 'plain' : c.lift >= UP ? 'up' : c.lift <= DOWN ? 'down' : 'plain';
      let tooltip = `${c.label}: ${num(c.n)} פרקים, ${pct(c.share)} ${periodLabel}`;
      if (this.period !== 'all') {
        tooltip += `\nפי ${c.lift.toFixed(1)} מהממוצע בכל השנים`;
      }
      return {
        key,
        label: c.label,
        path: sitePath(c.search_url),
        t: Math.sqrt(c.share / maxShare),
        tone,
        tooltip,
      };
    });
  }
}
