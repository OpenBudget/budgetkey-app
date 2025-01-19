import { Component } from '@angular/core';
import { DashboardSearchBarComponent } from '../dashboard-search-bar/dashboard-search-bar.component';
import { DashboardSearchResultsComponent } from '../dashboard-search-results/dashboard-search-results.component';
import { DashboardsApiService } from '../dashboards-api.service';

@Component({
    selector: 'app-dashboard-search',
    imports: [
        DashboardSearchBarComponent,
        DashboardSearchResultsComponent
    ],
    templateUrl: './dashboard-search.component.html',
    styleUrl: './dashboard-search.component.less'
})
export class DashboardSearchComponent {

  constructor(public api: DashboardsApiService) { }
}
