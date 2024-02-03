import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { Injectable, Inject, PLATFORM_ID, NgZone } from "@angular/core";
import { environment } from "../../environments/environment";
import * as memoryCache from 'memory-cache';
import { Observable, from, tap } from "rxjs";

@Injectable()
export class PlatformService {
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone) {}
  
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
        return from([ret]);
      } else {
        return request.pipe(
          tap((data: T) => {
            this.zone.runOutsideAngular(() => {
              memoryCache.put(key, data, 1000 * 60 * 60 * 24);
            });    
          })
        );
      }
    } else {
      return request;
    }
  }
  
}