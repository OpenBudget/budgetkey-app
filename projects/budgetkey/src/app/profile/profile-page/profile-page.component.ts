import { Component } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ListItem, ListsService } from '../../common-components/services/lists.service';
import { AuthService } from '../../auth/auth.service';
import { SEARCHES_LIST } from '../../common-components/constants';
import { PlatformService } from '../../common-components/platform.service';

declare const window: any;

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.less']
})
export class ProfilePageComponent {
  
  items = new ReplaySubject<Array<ListItem>>();
  init = false;
  authenticated = false;
  hasItems = false;
  loginUrl: string | null = null;
  
  constructor(private lists: ListsService, private auth: AuthService, private ps: PlatformService) {
    this.updateItems();
  }
  
  updateItems() {
    this.auth.check(window.location.href)
    .subscribe((result) => {
      if (result) {
        this.authenticated = result.authenticated;
        if (!result.authenticated) {
          this.init = true;
          this.hasItems = false;
          this.items.next([]);
          const login_href = result.providers && (result.providers.google || result.providers.github);
          if (login_href) {
            this.loginUrl = login_href.url;
          }
        }
      }
    });
    this.lists.get(SEARCHES_LIST)
    .subscribe((lc) => {
      this.init = true;
      this.hasItems = lc.items && lc.items.length > 0;
      this.items.next(lc.items);
      this.refreshShareThis();
    });
  }
  
  ngAfterViewInit() {
    this.refreshShareThis();
  }
  
  refreshShareThis() {
    this.ps.browser(() => {
      if (window.__sharethis__ && window.__sharethis__.initialize) {
        window.setTimeout(() => {
          window.__sharethis__.initialize();
        }, 1000);
      } else {
        console.log('Failed to find ShareThis buttons');
        window.setTimeout(() => {
          this.ngAfterViewInit();
        }, 3000);
      }
    });
  }
  
}
