import {Component, Inject, Input, signal} from '@angular/core';
import { GlobalSettingsService } from '../../global-settings.service';
import { Router } from '@angular/router';
import { platform } from 'os';
import { PlatformService } from '../../platform.service';
import { WindowService } from '../../window.service';
import { EMPTY, Subscription, fromEvent, switchMap, take, timer } from 'rxjs';
import { SeoService } from '../../seo.service';

@Component({
    selector: 'app-bk-header',
    templateUrl: './bk-header.component.html',
    styleUrls: ['./bk-header.component.less'],
})

export class BkHeaderComponent {
  @Input() showSearchBar = false;
  @Input() showLanguages = false;
  @Input() showShare = true;
  @Input() fakeSearchBar = true;
  public showAuth = false;
  public showCollapsedMenu = signal(false);
  public whatsappGroupModal = signal(false);
  collapseMenuSub: Subscription | null = null;
  logoRouterLink = ['/'];

  constructor (public globalSettings: GlobalSettingsService, private router: Router, private platform: PlatformService, private window: WindowService, public seo: SeoService) {
    this.showAuth = !globalSettings.theme.disableAuth && this.platform.browser();
    if (this.globalSettings.themeId === 'soproc') {
      this.logoRouterLink = ['/i/units/gov_social_service_unit/main'];
    }
  }

  doSearch(href?: string) {
    const themeId = this.globalSettings.theme.themeId;
    let _href = href || `https://next.obudget.org/s/?theme=${themeId}&lang=${this.globalSettings.lang}`;
    this.doNavigateURL(_href, '_self');
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
    this.doNavigateURL(href, '_blank');
  }

  doNavigateURL(href: string, target: string) {
    window.open(href, target);
  }

  openCollapsedMenu() {
    if (this.showCollapsedMenu()) {
      this.showCollapsedMenu.set(false);
      return;
    }
    this.showCollapsedMenu.set(true);
    if (this.window._) {
      this.collapseMenuSub?.unsubscribe();
      this.collapseMenuSub = timer(100).pipe(
        switchMap(() => this.window._ ? fromEvent(this.window._, 'click') : EMPTY),
        take(1),
      ).subscribe(() => {
        this.showCollapsedMenu.set(false);
      });
    }
  }

}
