import { Component, effect, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardsApiService } from '../dashboards-api.service';

@Component({
  selector: 'app-dashboard-vis-table',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-vis-table.component.html',
  styleUrl: './dashboard-vis-table.component.less'
})
export class DashboardVisTableComponent {

  @Input() query: string;
  @Output() loading = new EventEmitter<boolean>();

  data: any[] | null = null;
  fields: any[];
  request: Subscription;

  constructor(private api: DashboardsApiService) {
    effect(() => {
      if (this.request) {
        this.request.unsubscribe();
      }
      this.loading.emit(true);
      this.data = null;
      this.request = this.api.doQuery(this.query, this.api.selectedItem())
          .subscribe((rows: any[]) => {
            this.loading.emit(false);
            this.data = rows;
          });
    });
  }

  str(x: any) {
    return '' + x;
  }

  strw(x: any) {
    return `<span class='strw'>${x}</span>`;
  }

  fig(x: number) {
    if (!x) {
      return '&mdash;';
    }
    const digs = Math.abs(x) > 1000 ? 0 : 2;
    const xstr = x.toLocaleString([], {minimumFractionDigits: digs,
                                       maximumFractionDigits: digs});
    return `<span class='fig'>${xstr}</span>`;
  }

  ngOnInit() {
    const aliases = RegExp('[Aa][Ss]\\s+"(([^":]+):([^"]+))"', 'g');
    this.fields = [];
    let match: any;
    while ((match = aliases.exec(this.query)) != null) {
      const field = match[1];
      const title = match[2];
      const formatter = (this as any)[match[3]];
      this.fields.push({field, title, formatter});
    }
  }
}
