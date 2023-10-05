import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable()
export class PlatformService {
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  
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
  
}