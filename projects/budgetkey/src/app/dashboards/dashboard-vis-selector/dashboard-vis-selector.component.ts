import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DashboardVisTableComponent } from '../dashboard-vis-table/dashboard-vis-table.component';

@Component({
    selector: 'app-dashboard-vis-selector',
    imports: [
        DashboardVisTableComponent
    ],
    templateUrl: './dashboard-vis-selector.component.html',
    styleUrl: './dashboard-vis-selector.component.less'
})
export class DashboardVisSelectorComponent {

  @Input() vis: any;
  @Input() visible: boolean;
  @Output() loading = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  reportLoading(loading: boolean) {
    this.loading.emit(loading);
  }
}
