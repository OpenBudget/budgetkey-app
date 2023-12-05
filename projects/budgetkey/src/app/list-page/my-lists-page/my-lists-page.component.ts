import { Component, effect } from '@angular/core';
import { GlobalSettingsService } from '../../common-components/global-settings.service';
import { SeoService } from '../../common-components/seo.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { ListContents, ListsService } from '../../common-components/services/lists.service';
import { filter, map, switchMap } from 'rxjs';
import { Format } from '../../format';

@UntilDestroy()
@Component({
  selector: 'app-my-lists-page',
  templateUrl: './my-lists-page.component.html',
  styleUrls: ['./my-lists-page.component.less']
})
export class MyListsPageComponent {

  init = false;

  format = new Format();

  constructor(private globalSettings: GlobalSettingsService, private seo: SeoService, public lists: ListsService, private router: Router) {
    this.globalSettings.ready.subscribe(() => {
      this.init = true;
    });
  }
}
