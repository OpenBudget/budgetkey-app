import { Component, effect } from '@angular/core';
import { GlobalSettingsService } from '../../common-components/global-settings.service';
import { SeoService } from '../../common-components/seo.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private globalSettings: GlobalSettingsService, private seo: SeoService, private route: ActivatedRoute, private lists: ListsService, private router: Router) {
    this.globalSettings.ready.subscribe(() => {
      this.init = true;
    });
    effect(() => {
      this.list = lists.currentList();
    });
    this.route.params.pipe(
      untilDestroyed(this),
      map((params) => ({
        userId: params['user-id'],
        listId: params['list-id']
      })),
      filter((params) => !!params.listId && !!params.userId),
    ).subscribe((list) => {
      const key = `${list.userId}:${list.listId}`;
      this.router.navigate(['.'], { relativeTo: this.route, queryParams: { list: key }, queryParamsHandling: 'merge', replaceUrl: true});
    });
  }
}
