import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ListComponentsModule } from '../../list-components/list-components.module';
import { config } from '../configurations/config';
import { DashboardSearchComponent } from '../dashboard-search/dashboard-search.component';
import { DashboardVisualizationsComponent } from '../dashboard-visualizations/dashboard-visualizations.component';
import { DashboardsApiService } from '../dashboards-api.service';

@UntilDestroy()
@Component({
  selector: 'app-dashboards-page',
  standalone: true,
  imports: [
    ListComponentsModule,
    DashboardSearchComponent,
    DashboardVisualizationsComponent
  ],
  templateUrl: './dashboards-page.component.html',
  styleUrls: ['./dashboards-page.component.less']
})
export class DashboardsPageComponent {

  constructor(private api: DashboardsApiService, private route: ActivatedRoute) {
    this.route.params.pipe(
      untilDestroyed(this)
    ).subscribe(params => {
      this.api.config = config[params['config']];
      this.api.baseRoute = ['/dashboards', params['config']];
      if (params['item-id']) {
        this.api.selectItem(params['item-id']);
      } else {
        this.api.selectItem(null);
      }
    });
  }
}
