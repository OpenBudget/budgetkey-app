import {ErrorHandler, Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class AppErrorHandler implements ErrorHandler {

  constructor(@Inject(PLATFORM_ID) private platformId: any, private route: ActivatedRoute) {
  }

  handleError(error: any): void {
    if(isPlatformBrowser(this.platformId)) {
      this.handleBrowser(error);
    } else {
      this.handleServer(error);
    }
  }
  
  handleBrowser(error: any): void {
    console.log('ERR', new Date(), error);
  }
  
  handleServer(error: any): void {
    console.log('ERR', new Date(), this.route.snapshot.url, error);
  }
}