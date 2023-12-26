import { Component, WritableSignal, effect, signal } from '@angular/core';
import { GlobalSettingsService } from '../../common-components/global-settings.service';
import { SeoService } from '../../common-components/seo.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { ListContents, ListsService } from '../../common-components/services/lists.service';
import { filter, map, switchMap } from 'rxjs';
import { Format } from '../../format';
import { AuthService } from '../../common-components/auth/auth.service';

@UntilDestroy()
@Component({
  selector: 'app-user-lists-page',
  templateUrl: './user-lists-page.component.html',
  styleUrls: ['./user-lists-page.component.less']
})
export class UserListsPageComponent {

  init = false;

  format = new Format();

  publicLists = signal<ListContents[]>([]);
  theLists = this.publicLists;

  constructor(private globalSettings: GlobalSettingsService, private seo: SeoService, private auth: AuthService,
      public lists: ListsService, private router: Router, private route: ActivatedRoute) {
    this.globalSettings.ready.subscribe(() => {
      this.init = true;
    });
    this.route.params.pipe(
      untilDestroyed(this),
      map((params) => params['user-id']),
      filter((userId) => !!userId),
      switchMap((userId) => this.auth.getUser().pipe(
        map((user) => user?.profile?.id || ''),
        map((loggedInUserId) => ({ userId, loggedInUserId }))
      )),
      map(({userId, loggedInUserId}) => {
        if (userId === loggedInUserId) {
          return this.lists.curatedLists;
        } else {
          this.lists.getPublicLists(userId).pipe(
            untilDestroyed(this)
          ).subscribe((lists) => {
            this.publicLists.set(lists);
          });
          return this.publicLists;
        }
      })
    ).subscribe((listsSignal: WritableSignal<ListContents[]>) => {
      this.theLists = listsSignal;
    });
    effect(() => {
      const publicLists = this.publicLists();
      const curatedLists = this.lists.curatedLists();
      const lists = this.theLists() || publicLists || curatedLists;
      if (lists.length) {
        const userId = lists[0].user_id;
        const userName = lists[0].properties?.name;
        const title = `רשימות המשתמש ${userName}`;
        const canonical = `https://next.obudget.org/l/${userId}`;
        this.seo.setSeo(`${title} - מפתח התקציב`, canonical);
      }
    });
  }
}
