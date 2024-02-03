import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { untilDestroyed } from '@ngneat/until-destroy';
import { ReplaySubject, distinctUntilChanged, map, switchMap } from 'rxjs';
import { PlatformService } from './platform.service';
import { DEFAULT_THEME } from './theme.budgetkey.he';

const CACHE: any = {};

@Injectable()
export class GlobalSettingsService {

  ready = new ReplaySubject<void>(1);
  
  constructor(private ps: PlatformService, private http: HttpClient) { }

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
          return this.ps.cachedRequest(`theme.${themeId}`, this.http.get(this.ps.BASE + `/assets/themes/theme.${themeId}.${lang}.json`)).pipe(
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
}
