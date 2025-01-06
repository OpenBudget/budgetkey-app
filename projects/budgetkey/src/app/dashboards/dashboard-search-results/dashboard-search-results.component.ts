import { Component } from '@angular/core';
import { DashboardsApiService } from '../dashboards-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-search-results',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-search-results.component.html',
  styleUrl: './dashboard-search-results.component.less'
})
export class DashboardSearchResultsComponent {
  template: string;
  title: string;

  constructor(public api: DashboardsApiService, private router: Router) { }

  ngOnInit() {
    this.template = this.api.config.result_template;
    this.title = this.api.config.title;
  }

  render(item: any) {
    return this.template.replace(/:([a-z][-a-z0-9_.]*)/ig, (match, name) => {
      return item[name];
    });
  }

  set selected(item) {
    console.log('config', this.api.baseRoute);
    if (item) {
      this.router.navigate([...this.api.baseRoute, item.doc_id.split('/').join('__')], {queryParamsHandling: 'preserve'});
    } else {
      this.router.navigate(this.api.baseRoute, {queryParamsHandling: 'preserve'});
    }
  }

  get selected() {
    return this.api.selectedItem();
  }


}
