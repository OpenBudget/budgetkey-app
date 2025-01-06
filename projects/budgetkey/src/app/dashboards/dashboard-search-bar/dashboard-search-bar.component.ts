import { Component } from '@angular/core';
import { DashboardsApiService } from '../dashboards-api.service';

@Component({
  selector: 'app-dashboard-search-bar',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-search-bar.component.html',
  styleUrl: './dashboard-search-bar.component.less'
})
export class DashboardSearchBarComponent {

  constructor(public api: DashboardsApiService) { }

  doSearch(event: Event) {
    const el = event.target as HTMLInputElement;
    this.api.search(el.value)
  }
}
