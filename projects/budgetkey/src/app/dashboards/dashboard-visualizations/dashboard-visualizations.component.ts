import { Component, OnInit, signal } from '@angular/core';
import { DashboardsApiService } from '../dashboards-api.service';
import { DashboardVisNavComponent } from '../dashboard-vis-nav/dashboard-vis-nav.component';
import { DashboardVisSelectorComponent } from '../dashboard-vis-selector/dashboard-vis-selector.component';

@Component({
    selector: 'app-dashboard-visualizations',
    imports: [
        DashboardVisNavComponent,
        DashboardVisSelectorComponent
    ],
    templateUrl: './dashboard-visualizations.component.html',
    styleUrl: './dashboard-visualizations.component.less'
})
export class DashboardVisualizationsComponent {

  selectedVis = signal<string>('');
  loadingStatus: any = {};

  constructor(public api: DashboardsApiService) {
    this.selectedVis.set(this.api.config.visualizations[0].title);
  }
}