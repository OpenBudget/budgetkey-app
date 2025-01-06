import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DashboardsApiService } from '../dashboards-api.service';

@Component({
  selector: 'app-dashboard-vis-nav',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-vis-nav.component.html',
  styleUrl: './dashboard-vis-nav.component.less'
})
export class DashboardVisNavComponent {

  @Input() selectVis: string;
  @Input() loadingStatus: any;
  @Output() selected = new EventEmitter<string>();

  constructor(public api: DashboardsApiService) { }

  ngOnInit() {
  }

  selectedVis(title: string) {
    this.selected.emit(title);
  }

}
