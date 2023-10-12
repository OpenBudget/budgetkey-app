import {ErrorHandler, Inject, Injectable, NgZone, Optional, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';

@Injectable()
export class AppErrorHandler implements ErrorHandler {

  constructor(@Inject(PLATFORM_ID) private platformId: any, private route: ActivatedRoute, private router: Router, 
              private zone: NgZone, @Optional() @Inject(REQUEST) private request: Request) {
  }

  handleError(error: any): void {
    if(isPlatformBrowser(this.platformId)) {
      this.handleBrowser(error);
    } else {
      this.handleServer(error);
    }
  }
  
  pageNotFound(error: any): boolean {
    const msg = error.message || error;
    return msg.indexOf('Cannot match any routes') > -1;
  }

  handleBrowser(error: any): void {
    if (this.pageNotFound(error)) {
      this.router.navigate(['/not-found'], {queryParamsHandling: 'preserve', skipLocationChange: true});
      return;
    }
    console.log('ERR', new Date().toISOString(), error.message || error);
  }
  
  handleServer(error: any): void {
    if (this.pageNotFound(error)) {
      this.request?.res?.status(404);
      this.zone.run(() => this.router.navigate(['/not-found'], {queryParamsHandling: 'preserve', replaceUrl: true}));
      return;
    }
    const path = this.request?.originalUrl || this.route.snapshot.url;
    console.log(`ERR | ${new Date().toISOString()} | ${path} | ${error.message}\n${error.stack}`);
  }
}