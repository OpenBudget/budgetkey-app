import { Component, OnInit, ViewChild } from '@angular/core';
import { BkSearchBar, SearchBarType } from '../../common-components/components/searchbar/bk-search-bar.component';
import { SearchComponent } from '../search/search.component';
import { GlobalSettingsService } from '../../common-components/global-settings.service';
import { PlatformService } from '../../common-components/platform.service';

@Component({
  selector: 'app-bare-page',
  templateUrl: './bare-page.component.html',
  styleUrls: ['./bare-page.component.less']
})
export class BarePageComponent implements OnInit {

  all: SearchBarType;

  @ViewChild('search') search: SearchComponent;

  constructor(
    public globalSettings: GlobalSettingsService, private ps: PlatformService
  ) {
  }

  ngOnInit() {
    this.all = this.globalSettings.theme.searchBarConfig[0];
  }

  externalUrl() {
    return BkSearchBar.buildExternalUrl(
      this.search.searchState.term || '',
      this.all,
      this.search.subscriptionUrlParams,
      this.globalSettings.theme, this.globalSettings.lang,
      this.ps.browser() ? window.location.hostname : 'next.obudget.org'
    );
  }
}
