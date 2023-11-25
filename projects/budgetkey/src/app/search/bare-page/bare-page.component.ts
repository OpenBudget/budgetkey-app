import { Component, OnInit, ViewChild } from '@angular/core';
import { BkSearchBar, SearchBarType } from '../../common-components/components/searchbar/bk-search-bar.component';
import { SearchComponent } from '../search/search.component';
import { GlobalSettingsService } from '../../common-components/global-settings.service';
import { PlatformService } from '../../common-components/platform.service';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-bare-page',
  templateUrl: './bare-page.component.html',
  styleUrls: ['./bare-page.component.less']
})
export class BarePageComponent implements OnInit {

  all: SearchBarType;
  init = false;

  @ViewChild('search') search: SearchComponent;

  constructor(
    public globalSettings: GlobalSettingsService, private ps: PlatformService, private route: ActivatedRoute
  ) {
    globalSettings.init(this, route);
  }

  ngOnInit() {
    this.globalSettings.ready.subscribe(() => {
      this.all = this.globalSettings.theme.searchBarConfig[0];
      this.init = true;
    });
  }

  externalUrl(): string {
    return BkSearchBar.buildExternalUrl(
      this.search.searchState.term || '',
      this.all,
      this.search.subscriptionUrlParams,
      this.globalSettings.theme, this.globalSettings.lang,
      this.ps.browser() ? window.location.hostname : 'next.obudget.org'
    )[0];
  }
}
