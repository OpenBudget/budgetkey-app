import {Component, Inject, Input, Output, EventEmitter, OnChanges, OnInit} from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ListsService, ListItem, ListContents } from '../../services/lists.service';
import { SEARCHES_LIST } from '../../constants';
import { first, tap } from 'rxjs/operators';
import { from, fromEvent } from 'rxjs';
import { PlatformService } from '../../platform.service';

@Component({
    selector: 'app-bk-subscription-manager',
    templateUrl: 'bk-subscription-manager.component.html',
    styleUrls: ['bk-subscription-manager.component.less'],
    standalone: false
})
export class BkSubscriptionManager implements OnInit {
  @Input() externalUrl: string;
  @Input() externalTitle: string;
  @Input() externalProperties: any;
  @Input() term: string;
  @Input() context: string;
  @Input() docType: any;
  @Input() newWindow = false;
  
  public isLoggedIn: boolean;
  public loginUrl: string | null = null;
  public loginModal = false;
  private subscribedUrls: any = {};
  
  constructor (private auth: AuthService, private lists: ListsService, private ps: PlatformService) {
    ps.browser(() => {
      fromEvent(window, 'message').subscribe((evt) => {
        console.log('GOT Message', evt);
        if (this.loginModal) {
          this.auth.check();
        }
        this.loginModal = false;
      });    
    });
  }
  
  public isSubscribed() {
    return this.subscribedUrls.hasOwnProperty(this.urlKey(this.externalUrl));
  }
  
  public _starClicked() {
    if (this.isLoggedIn) {
      if (this.isSubscribed()) {
        return this.lists.delete(SEARCHES_LIST, this.subscribedUrls[this.externalUrl])
          .pipe(
            tap((success) => {
              const key = this.urlKey(this.externalUrl);
              if (key) {
                delete this.subscribedUrls[key];
              }
            })
          );
      } else {
        const item = new ListItem();
        item.url = this.externalUrl;
        item.title = this.externalTitle || this.term;
        item.properties = this.externalProperties || {
          docType: this.docType,
          period: {
            value: 'all'
          },
          kind: 'search',
          term: this.term,
          context: this.context
        };
        return this.lists.put(SEARCHES_LIST, item)
          .pipe(
            tap((added) => {
              const key = this.urlKey(item.url);
              if (key) {
                this.subscribedUrls[key] = item.id;
              }
            })
          );
      }
    } else {
      this.loginModal = true;
      let search = document.location.search.trim();
      if (search.startsWith('?')) {
        search = search.substring(1);
      }
      const params = new URLSearchParams(search);
      params.set('subscribe', 'true');
      if (this.newWindow) {
        params.set('nw', 'true');
      }
      search = params.toString();
      const href = document.location.href.split('?')[0] + '?' + search;
      return this.auth.check(href)
        .pipe(
          tap((user) => {
            const login_href = user.providers && (user.providers.google || user.providers.github);
            if (login_href) {
              this.loginUrl = login_href.url;
            }
          })
        );
    }
  }
        
  public starClicked() {
    this._starClicked().pipe(first()).subscribe(() => {
      console.log('Star Clicked');
    });
  }
        
  ngOnInit() {
    this.ps.browser(() => {
      this.auth.getUser()
        .subscribe((user) => {
          this.isLoggedIn = user && user.authenticated;
          if (this.isLoggedIn) {
            this.lists.get(SEARCHES_LIST)
              .subscribe((lc: ListContents) => {
                for (const item of (lc.items || [])) {
                  const key = this.urlKey(item.url);
                  if (key) {
                    this.subscribedUrls[key] = item.id;
                  }
                }
                this.checkIfSubscribeOrCloseNeeded();
              });
          } else {
            if (user && user.providers && user.providers.google) {
              this.loginUrl = user.providers.google.url;
            }
            this.subscribedUrls = {};
          }
        });
    });
  }
  
  checkIfSubscribeOrCloseNeeded() {
    let search = document.location.search.trim();
    if (search.startsWith('?')) {
      search = search.substring(1);
    }
    const params = new URLSearchParams(search);
    const subscribe = params.get('subscribe');
    let obs = from([true]);
    if (subscribe === 'true') {
      // remove the jwt query param from the URL
      params.delete('subscribe');
      search = params.toString();
      history.replaceState(null,
        document.title,
        document.location.href.split('?')[0] + '?' + search
      );
      if (!this.isSubscribed()) {
        obs = this._starClicked();
      }
    }
    obs.subscribe(() => {
      if (params.has('nw')) {
        const _opener = window.opener;
        if (_opener) {
          _opener.postMessage('check', 'https://next.obudget.org');
        }
        window.close();
      }
    });
  }
    
  urlKey(url: string): string | null {
    const search = url.split('?')[1];
    if (search) {
      const p = new URLSearchParams(search);
      return `${p.get('q')}/${p.get('dd')}`;
    }
    return null;
  }
}
  