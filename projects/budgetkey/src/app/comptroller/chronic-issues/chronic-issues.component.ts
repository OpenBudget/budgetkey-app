import { Component, Input, OnChanges } from '@angular/core';
import { ChronicIssue, Comptroller } from '../comptroller-dash.service';
import { axisPos, sitePath, surname, year } from '../dash-utils';
import { status, Status } from '../../common-components/comptroller-labels';

interface Band {
  name: string;
  start: number;
  width: number;
}

interface Row {
  issue: ChronicIssue;
  path: string;
  years: number;
  start: number;
  width: number;
  verdictTone: string;
  government: Status | null;
  tooltip: string;
}

const SHOWN = 6;
const TICKS = [2000, 2005, 2010, 2015, 2020, 2025];

// The longest-running unresolved issues, each a ribbon from its first report to the latest follow-up,
// over the comptrollers' terms
@Component({
  selector: 'app-chronic-issues',
  templateUrl: './chronic-issues.component.html',
  styleUrls: ['./chronic-issues.component.less'],
  standalone: false
})
export class ChronicIssuesComponent implements OnChanges {
  @Input() issues: ChronicIssue[] = [];
  @Input() comptrollers: Comptroller[] = [];
  @Input() download?: string;

  year = year;
  rows: Row[] = [];
  bands: Band[] = [];
  ticks = TICKS.map((y) => ({year: y, pos: axisPos(`${y}-01-01`)}));
  expanded = false;
  shownCount = SHOWN;

  ngOnChanges() {
    this.bands = this.comptrollers.map((c) => {
      const start = axisPos(c.start_date);
      return {name: surname(c), start, width: axisPos(c.end_date) - start};
    });
    this.rows = this.issues.map((issue) => {
      const start = axisPos(issue.first_reported);
      const years = Math.floor(issue.years_open);
      return {
        issue,
        path: sitePath(issue.url),
        years,
        start,
        width: Math.max(0.01, axisPos(issue.latest_verdict_date) - start),
        verdictTone: issue.latest_verdict_label === 'לא תוקן' ? 'bad' : 'poor',
        government: status(issue.government_status),
        tooltip: `נמצא לראשונה ב-${year(issue.first_reported)}: ${issue.first_chapter_title}\n` +
                 `נבדק לאחרונה ב-${year(issue.latest_verdict_date)}: ${issue.latest_verdict_chapter_title}`,
      };
    });
  }

  get shown(): Row[] {
    return this.expanded ? this.rows : this.rows.slice(0, this.shownCount);
  }

}
