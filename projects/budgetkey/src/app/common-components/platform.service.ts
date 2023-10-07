import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { Injectable, Inject, PLATFORM_ID, makeStateKey, StateKey } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import * as memoryCache from 'memory-cache';
import { Observable, from, tap } from "rxjs";
import { TransferState } from "@angular/core";

@Injectable()
export class PlatformService {
  
  constructor(private http: HttpClient, private transferState: TransferState, @Inject(PLATFORM_ID) private platformId: Object) {}
  
  get BASE() {
    if (isPlatformBrowser(this.platformId)) {
      return '';
    } else {
      return environment.ssrBase;
    }
  }
  
  browser<T>(callable?: () => void): boolean {
    if (isPlatformBrowser(this.platformId)) {
      if (callable) {
        callable();
      }
      return true;
    }
    return false;
  }
  
  server<T>(callable?: () => void): boolean {
    if (isPlatformServer(this.platformId)) {
      if (callable) {
        callable();
      }
      return true;
    }
    return false;
  }

  cachedRequest<T>(key: string, request: Observable<T>): Observable<T> {
    if (this.server()) {
      if (memoryCache.get(key)) {
        const ret = memoryCache.get(key) as T;
        this.transferState.set(makeStateKey(key) as StateKey<T>, ret);
        return from([ret]);
      } else {
        return request.pipe(
          tap((data: T) => {
            memoryCache.put(key, data, 1000 * 60 * 60 * 24);
          })
        );
      }
    } else {
      const stateKey =  makeStateKey(key) as StateKey<T>;
      if (this.transferState.hasKey(stateKey)) {
        console.log('CACHE BROWSER HIT', key);
        const ret = this.transferState.get(stateKey, null) as T;
        return from([ret]);
      }
      console.log('CACHE BROWSER MISS', key, this.transferState);
      return request;
    }
  }
  
}