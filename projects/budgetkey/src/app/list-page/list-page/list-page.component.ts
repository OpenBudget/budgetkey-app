import { Component, Inject, Optional, effect } from '@angular/core';
import { GlobalSettingsService } from '../../common-components/global-settings.service';
import { SeoService } from '../../common-components/seo.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { ListContents, ListsService } from '../../common-components/services/lists.service';
import { filter, map, switchMap } from 'rxjs';
import { PlatformService } from '../../common-components/platform.service';
import { REQUEST } from '../../../express.tokens';
import { Request } from 'express';

@UntilDestroy()
@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.less']
})
export class ListPageComponent {

  init = false;
  list: ListContents|null = null;
  listKey: string|null = null;
  canonical: string = '';
  userId: string = ''

  constructor(private globalSettings: GlobalSettingsService, private seo: SeoService, private route: ActivatedRoute,
      private lists: ListsService, private router: Router, private ps: PlatformService, @Optional() @Inject(REQUEST) private request: Request) {
    this.globalSettings.ready.subscribe(() => {
      this.init = true;
    });
    effect(() => {
      const list = lists.currentList();
      if (!this.listKey) {
        return;
      }
      if (this.listKey !== `${list?.user_id}:${list?.name}`) {
        return;
      }
      if (list?.success === false) {
        this.ps.server(() => {
          this.request?.res?.status(404);
        });
        this.router.navigate(['/not-found'], {queryParamsHandling: 'preserve', replaceUrl: true});
      } else {
        this.list = list;
        this.seo.setSeo(`${list?.title} - מפתח התקציב`, this.canonical);
      }
    });
    this.route.params.pipe(
      untilDestroyed(this),
      map((params) => ({
        userId: params['user-id'],
        listId: params['list-id']
      })),
      filter((params) => !!params.listId && !!params.userId),
    ).subscribe((list) => {
      this.listKey = `${list.userId}:${list.listId}`;
      this.userId = list.userId;
      this.canonical = `https://next.obudget.org/l/${list.userId}/${list.listId}`;
      this.router.navigate(['.'], { relativeTo: this.route, queryParams: { list: this.listKey }, queryParamsHandling: 'merge', replaceUrl: true});
    });
  }

  onDeleted() {
    if (this.lists.curatedLists().length > 0) {
      this.router.navigate(['/l', this.userId], { queryParamsHandling: 'preserve'});
    } else {
      this.router.navigate(['/'], { queryParamsHandling: 'preserve' });
    }
  }
}
