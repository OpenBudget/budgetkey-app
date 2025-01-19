import { Component, OnInit } from '@angular/core';
import { GlobalSettingsService } from '../../common-components/global-settings.service';
import { SeoService } from '../../common-components/seo.service';

@Component({
    selector: 'app-search-page',
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.less'],
    standalone: false
})
export class SearchPageComponent implements OnInit {

  init = false;

  constructor(private globalSettings: GlobalSettingsService, private seo: SeoService) {
    globalSettings.ready.subscribe(() => {
      this.init = true;
    });
  }

  ngOnInit(): void {
    this.globalSettings.ready.subscribe(() => {
      this.seo.setSeo(this.globalSettings.siteName + ' - חיפוש', `https://next.obudget.org/s`);
    });
  }
}
