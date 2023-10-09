import {ErrorHandler, Inject, Injectable, Optional, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';

@Injectable()
export class AppErrorHandler implements ErrorHandler {

  constructor(@Inject(PLATFORM_ID) private platformId: any, private route: ActivatedRoute, @Optional() @Inject(REQUEST) private request: Request) {
  }

  handleError(error: any): void {
    if(isPlatformBrowser(this.platformId)) {
      this.handleBrowser(error);
    } else {
      this.handleServer(error);
    }
  }
  
  handleBrowser(error: any): void {
    console.log('ERR', new Date().toISOString(), error.message || error);
  }
  
  handleServer(error: any): void {
    const path = this.request?.originalUrl || this.route.snapshot.url;
    console.log('ERR', new Date().toISOString(), path, error.message, '\n' + error.stack);
  }
}