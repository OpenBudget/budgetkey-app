import {Component, Inject, Input} from '@angular/core';
import { GlobalSettingsService } from '../../global-settings.service';

@Component({
    selector: 'app-bk-header',
    templateUrl: './bk-header.component.html',
    styleUrls: ['./bk-header.component.less'],
})

export class BkHeaderComponent {
    @Input() showSearchBar = false;
    @Input() showLanguages = false;
    public showAuth = false;

    constructor (public globalSettings: GlobalSettingsService) {
      this.showAuth = !globalSettings.theme.disableAuth;
    }

    doSearch(href?: string) {
      const themeId = this.globalSettings.theme.themeId || 'budgetkey';
      const _href = href || `//next.obudget.org/s/?theme=${themeId}&lang=${this.globalSettings.lang}`;
      window.open(_href, '_self');
    }

    switchLang(lang: string) {
      const param = 'lang=' + lang;
      let search = window.location.search;
      search = search.replace(RegExp('lang=[a-z]{2}'), param);
      if (search.indexOf(param) < 0) {
        if (search[0] === '?') {
          search += '&' + param;
        } else {
          search = '?' + param;
        }
      }
      window.location.search = search;
    }

    doNavigate(href: string) {
        window.open(href, '_blank');
    }
}
