import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { BudgetKeyItemService } from '../../budgetkey-item.service';
import { QuestionsManager } from '../questions-manager';
import { GlobalSettingsService } from '../../../common-components/global-settings.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'app-item-data-table',
    templateUrl: './item-data-table.component.html',
    styleUrls: ['./item-data-table.component.less'],
    standalone: false
})
export class ItemDataTableComponent implements OnInit {

  @Input() manager: QuestionsManager;

  private tableState = 'hidden';

  private query = '';
  headers: any[] = [];
  data: any[] = [];
  total = 0;
  err: any;
  graphAvailable = true;
  graphSelected = true;
  graphLayout: any;
  graphData: any;

  constructor(private itemService: BudgetKeyItemService, private globalSettings: GlobalSettingsService) {
  }

  ngOnInit() {
    this.manager.dataQueryChange.pipe(
      untilDestroyed(this)
    ).subscribe(() => this.onDataLoading());
    this.manager.dataReady.pipe(
      untilDestroyed(this)
    ).subscribe((ev) => this.onDataReady(ev));
  }

  toggleTable() {
    this.tableState = this.tableState === 'visible' ? 'hidden' : 'visible';
  }

  private onDataLoading() {
    this.headers.length = 0;
    this.data.length = 0;
  }

  private onDataReady(ev: any) {
    const {headers, data, err, total, graphData, graphLayout} = ev;
    this.headers = headers;
    this.data = data;
    this.err = err;
    this.total = total;
    this.graphData = graphData;
    this.graphLayout = graphLayout;
    if (headers.length) {
      if (!graphLayout) {
        this.graphAvailable = false;
        this.graphSelected = false;
      } else {
        this.graphAvailable = true;
        this.graphSelected = true;
      }
    }
  }
}
