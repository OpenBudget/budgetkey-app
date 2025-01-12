import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ListComponentsModule } from '../../list-components/list-components.module';
import { config } from '../configurations/config';
import { DashboardSearchComponent } from '../dashboard-search/dashboard-search.component';
import { DashboardVisualizationsComponent } from '../dashboard-visualizations/dashboard-visualizations.component';
import { DashboardsApiService } from '../dashboards-api.service';
import { map, tap } from 'rxjs';
import { ItemModule } from '../../item/item.module';

@UntilDestroy()
@Component({
  selector: 'app-dashboards-page',
  standalone: true,
  imports: [
    ListComponentsModule,
    DashboardSearchComponent,
    DashboardVisualizationsComponent,
    ItemModule
  ],
  templateUrl: './dashboards-page.component.html',
  styleUrls: ['./dashboards-page.component.less']
})
export class DashboardsPageComponent {

  constructor(private api: DashboardsApiService, private route: ActivatedRoute) {
    this.route.params.pipe(
      untilDestroyed(this)
    ).subscribe(params => {
      console.log('params', params);
      this.api.config = config[params['config']];
      this.api.baseRoute = ['/dashboards', params['config']];
    });
    this.route.url.pipe(
      untilDestroyed(this),
      tap((url: any) => {
        console.log('url', url);
      }),
      map((url: any) => url.map((s: any) => s.path).join('/')),
    ).subscribe((itemId: string) => {
      console.log('itemId', itemId);
      if (itemId && itemId.length) {
        this.api.selectItem(itemId);
      } else {
        this.api.selectItem(null);
      }
    })
  }
}
