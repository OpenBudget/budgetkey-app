import { HttpClient } from '@angular/common/http';
import { Injectable, PendingTasks } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { untilDestroyed } from '@ngneat/until-destroy';
import { Observable, ReplaySubject, distinctUntilChanged, from, map, switchMap } from 'rxjs';
import { PlatformService } from './platform.service';
import { DEFAULT_THEME } from './theme.budgetkey.he';

const CACHE: any = {};

@Injectable()
export class GlobalSettingsService {

  ready = new ReplaySubject<void>(1);
  
  constructor(private ps: PlatformService, private http: HttpClient, private pendingTasks: PendingTasks) { }

  lang = 'he';
  themeId = 'budgetkey';
  siteName = 'מפתח התקציב';
  theme: any = DEFAULT_THEME;

  init(component: any, route: ActivatedRoute) {
    route.queryParams.pipe(
      untilDestroyed(component),
      map((params: any) => {
          const themeId = params.theme || 'budgetkey';
          const lang = params.lang || 'he';
          return {themeId, lang};
      }),
      distinctUntilChanged((a, b) => {
          return a.themeId === b.themeId && a.lang === b.lang;
      }),
      switchMap(({themeId, lang}) => {
          return this.ps.cachedRequest(`theme.${themeId}`, this.fetchTheme(themeId, lang)).pipe(
              map((theme: any) => {
                  return {theme, themeId, lang};
              })
          );
      })
    ).subscribe(({theme, themeId, lang}) => {
      const theme_ = Object.assign({}, 
          theme.BUDGETKEY_APP_GENERIC_ITEM_THEME || {},
          theme.BUDGETKEY_NG2_COMPONENTS_THEME || {}
      );
      this.theme = theme_;
      this.lang = lang;
      this.themeId = themeId;
      this.siteName = theme_.siteName;      
      this.ready.next();
      this.ready.complete();
    });
  }

  // On the server the default theme comes from the build, not over HTTP: when the pages are
  // prerendered at build time there's no server to fetch it from, and a page without its theme
  // renders empty, with the site's generic title and share tags. The browser never loads this chunk.
  // Unlike an HTTP request, the import isn't something the server waits for on its own, so it's
  // registered as a pending task; otherwise the page would be sent before the theme arrives.
  private fetchTheme(themeId: string, lang: string): Observable<any> {
    if (this.ps.server() && themeId === 'budgetkey' && lang === 'he') {
      return from(this.pendingTasks.run(() => import('../../assets/themes/theme.budgetkey.he.json').then((m) => m.default)));
    }
    return this.http.get(this.ps.BASE + `/assets/themes/theme.${themeId}.${lang}.json`);
  }
}
