import { Component, OnInit } from '@angular/core';
import { GlobalSettingsService } from '../../common-components/global-settings.service';
import { NgxSeoService } from '@avivharuzi/ngx-seo';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.less']
})
export class SearchPageComponent implements OnInit {

  init = false;

  constructor(private globalSettings: GlobalSettingsService, private ngxSeoService: NgxSeoService) {
    globalSettings.ready.subscribe(() => {
      this.init = true;
    });
  }

  ngOnInit(): void {
    this.globalSettings.ready.subscribe(() => {
      this.ngxSeoService.setSeo({
        title: this.globalSettings.siteName + ' - חיפוש',
      });
    });
  }
}
