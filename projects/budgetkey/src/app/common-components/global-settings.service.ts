import { Injectable, TransferState, PLATFORM_ID, Inject } from '@angular/core';
import { DEFAULT_THEME } from './theme.budgetkey.he';
import { Observable, ReplaySubject, from, tap } from 'rxjs';

const CACHE: any = {};

@Injectable()
export class GlobalSettingsService {

  ready = new ReplaySubject<void>(1);
  
  constructor() { }

  lang = 'he';
  themeId = 'budgetkey';
  siteName = 'מפתח התקציב';
  theme: any = DEFAULT_THEME;

  // cacheSet(key: string, value: any) {
  //   if (isPlatformServer(this.platformId)) {
  //     console.log(key, 'SETTING CACHE', value);
  //     this.transferState.set(makeStateKey(key), value);
  //     CACHE[key] = value;
  //   }
  // }

  // cacheGet(key: string) {
  //   let value: any;
  //   if (isPlatformServer(this.platformId)) {
  //     if (CACHE.hasOwnProperty(key)) {
  //       value = CACHE[key];
  //     }
  //     this.transferState.set(makeStateKey(key), value);
  //   } else {
  //     if (this.transferState.hasKey(makeStateKey(key))) {
  //       value = this.transferState.get(makeStateKey(key), undefined);
  //     }
  //   }
  //   return value;
  // }

  // cachedHttp<T>(key: string, request: Observable<T>) {
  //   let value = this.cacheGet(key);
  //   console.log(key, 'CHECKING CACHE', value);
  //   if (value === undefined) {
  //     console.log(key, 'NOT IN CACHE', request);
  //     return request.pipe(
  //       tap((v: T) => this.cacheSet(key, v))
  //     );
  //   } else {
  //     return from([value]);
  //   }
  // }
}
