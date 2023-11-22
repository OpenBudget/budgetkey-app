import { Component } from '@angular/core';
import { GlobalSettingsService } from '../../common-components/global-settings.service';
import { SeoService } from '../../common-components/seo.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute } from '@angular/router';
import { ListContents, ListsService } from '../../common-components/services/lists.service';
import { filter, map, switchMap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.less']
})
export class ListPageComponent {

  init = false;
  list: ListContents|null = null;

  constructor(private globalSettings: GlobalSettingsService, private seo: SeoService, private route: ActivatedRoute, private lists: ListsService) {
    globalSettings.ready.subscribe(() => {
      this.init = true;
    });
    this.route.params.pipe(
      untilDestroyed(this),
      map((params) => params['list-id']),
      filter((listId) => !!listId),
      switchMap((listId) => this.lists.get(listId)),
    ).subscribe((list) => {
      this.list = list;
    });
  }

  ngOnInit(): void {
    this.globalSettings.ready.subscribe(() => {
      // this.seo.setSeo(this.globalSettings.siteName + ' - חיפוש', `https://next.obudget.org/s`);
    });
  }
}
