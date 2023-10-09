import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { EMPTY, catchError, delay, filter, first, map, switchMap, tap, timer } from 'rxjs';
import { GlobalSettingsService } from '../../common-components/global-settings.service';
import { ItemApiService } from '../item-api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
// import { QuestionsPanelComponent } from '../questions/questions-panel/questions-panel.component';
import { Question } from '../model';
import { PlatformService } from '../../common-components/platform.service';
import { QuestionsPanelComponent } from '../questions/questions-panel/questions-panel.component';
import { SeoService } from '../../common-components/seo.service';

@UntilDestroy()
@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.less']
})
export class ItemPageComponent implements AfterViewInit, OnInit {
  item: any | null;
  itemId: string;
  descriptor: any | null;
  style: string;
  init = false;

  @ViewChild('questionsPanel') questionsPanel: QuestionsPanelComponent;

  showQuestions = false;
  questions: Question[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private seo: SeoService,
    public globalSettings: GlobalSettingsService, private itemApi: ItemApiService, private ps: PlatformService) {
  }

  ngOnInit() {
    this.globalSettings.ready.pipe(
      untilDestroyed(this),
      switchMap(() => this.route.url),
      map((url: any) => url.map((s: any) => s.path).join('/')),
      tap((url: string) => {
        this.init = false;
        this.itemId = url;
        this.showQuestions = false;
        // this.descriptor = this.fetchDescriptor(this.itemId);
      }),
      switchMap((id: string) => this.itemApi.fetchItem(id)),
      catchError((err) => {
        return EMPTY;
      }),
    ).subscribe((item: any) => {
      if (item) {
        this.init = true;
        this.item = item;
        this.seo.setSeo(this.globalSettings.siteName + ' - ' + item.page_title, `https://next.obudget.org/i/${item.doc_id}`);
      }
    });
    this.route.queryParamMap.pipe(
      untilDestroyed(this),
      first(),
      map((params: ParamMap) => params.get('li')),
      filter((li: string | null) => li !== null),
      map((li: string | null) => parseInt(li || '', 10)),
      filter((li: number) => !isNaN(li)),
    ).subscribe((searchPosition) => {
      this.router.navigate([], {queryParams: {li: null}, queryParamsHandling: 'merge', replaceUrl: true});
      this.ps.browser(() => {
        const gtag = (<any>window).gtag;
        if (gtag) {
          timer(5000).subscribe(() => {
            gtag('event', 'view_item', {
              'event_label': this.itemId,
              'value': searchPosition
            });
          });
        }
      });
    });
    this.itemApi.questions.pipe(
      untilDestroyed(this),
      delay(0),
    ).subscribe((questions: any) => {
      if (questions) {
        this.showQuestions = this.ps.browser();
        this.questions = questions;
      }
    });
  }

  ngAfterViewInit() {
    this.route.fragment.pipe(
      first(),
      filter((fragment: string | null) => fragment === 'questions'),
      delay(this.ps.browser() ? 3000 : 0),
    ).subscribe(() => {
      this.questionsPanel.scrollToTable();
    });
  }

  prefix(prefix: string): boolean {
    if (!this.itemId) {
      return false;
    }
    const searchPattern = new RegExp('^' + prefix);
    return searchPattern.test(this.itemId);
  }

}
