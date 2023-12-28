import { Component, Inject, Optional } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalSettingsService } from '../common-components/global-settings.service';
import { PlatformService } from '../common-components/platform.service';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.less']
})
export class PageNotFoundComponent {

  constructor(
    private route: ActivatedRoute, 
    private globalSettings: GlobalSettingsService, 
    private ps: PlatformService,
    @Optional() @Inject(REQUEST) private request: Request
  ) {
    this.globalSettings.ready.subscribe(() => {
      if (this.ps.server()) {
        this.request?.res?.status(404);
      }
    });
  }
}
