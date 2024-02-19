import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { animationFrameScheduler, fromEvent, scheduled } from 'rxjs';
import { debounceTime, delay, skip, switchMap, take, tap, throttleTime } from 'rxjs/operators';
import { SearchBarType } from '../../common-components/components/searchbar/bk-search-bar.component';
import { PlatformService } from '../../common-components/platform.service';
import { SearchParams } from '../../common-components/search-models';
import { SearchApiService } from '../search-api.service';
import { SearchManager, SearchOutcome } from '../search-manager/search-manager';
import { SearchState, mergeFilters } from '../search-state/search-state';
import { LayoutService } from '../../common-components/layout.service';


@UntilDestroy()
@Component({
  selector: 'horizontal-results',
  templateUrl: './horizontal-results.component.html',
  styleUrls: ['./horizontal-results.component.less']
})
export class HorizontalResultsComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() docType: SearchBarType;
  @Input() state: SearchState;
  @Input() anySearching: boolean;
  @Input() bare = false;
  @Output() searching = new EventEmitter<boolean>();
  @Output() clicked = new EventEmitter<boolean>();
  @ViewChild('cards') cards: ElementRef<HTMLElement>;

  searchManager: SearchManager;
  lastOutcome: SearchOutcome;
  docTypes: SearchBarType[];
  gotMore = false;
  showLeftFade = false;
  showRightFade = false;
  refresh = false;

  constructor(private searchService: SearchApiService, private ps: PlatformService, private layout: LayoutService) { }

  ngOnInit() {
    this.docTypes = [this.docType];
    this.docType['score'] = 0;
    if (this.docType.filterMenu && this.docType.filterMenu.length > 0) {
      for (const option of this.docType.filterMenu[0].options) {
        this.docTypes.push(Object.assign({}, this.docType, {
          id: option.id,
          display: option.display,
          filters: mergeFilters(this.docType.filters, option.filters)
        }));
      }
    }
    this.state.searchQueue
        .pipe(
          untilDestroyed(this),
          debounceTime(this.ps.browser() ? 1000 : 0),
          switchMap((sp) => {
            return this.searchService.search({
              docType: this.docTypes[0],
              offset: 0,
              pageSize: 1,
              term: sp.term,
              // period: null,
              filters: this.docType.filters,
              context: this.state.searchContext,
              ordering: sp.term ? null : this.docType.ordering
            });
          })
        ).subscribe((sr) => {
          if (sr && sr.search_results && sr.search_results.length > 0) {
            this.docType.score = sr.search_results[0].score;
          }
          if (sr.search_counts && this.docType.id === 'all') {
            this.docType.amount = sr.search_counts._current.total_overall || 0;
          }
        });

    if (this.docType.id !== 'all') {
      this.searchManager = new SearchManager(
        this.searchService,
        this.state,
        this.docTypes,
        1000,
        this,
        (sp: SearchParams) => {
          if (sp.offset === 0) {
            const ret = new SearchParams(sp);
            ret.docType = this.docType;
            ret.filters = this.docType.filters;
            ret.pageSize = 3;
            // ret.period = null;
            return ret;
          } else {
            sp.pageSize = 10;
          }
          return sp;
        }
      );
      this.searchManager.searchResults.pipe(
        untilDestroyed(this),
        tap((outcome) => {
          this.lastOutcome = outcome;
          this.searching.emit(outcome.isSearching);
          this.showLeftFade = true;
          this.refresh = !this.refresh;
        }),
        delay(100),
        tap(() => {
          this.refresh = !this.refresh;
          this.scrollHandler(this.cards.nativeElement as HTMLElement);
        })
      ).subscribe();
    }
  }

  ngAfterViewInit() {
    this.ps.browser(() => {
      if (this.cards?.nativeElement) {
        fromEvent(this.cards.nativeElement, 'scroll').pipe(
          untilDestroyed(this),
          throttleTime(150, animationFrameScheduler),
          delay(150)
        ).subscribe((event: Event) => {
          this.scrollHandler(event.target as HTMLElement);
        });
      }
    });
  }

  ngOnDestroy() {
  }

  shouldShow() {
    return this.docType.id !== 'all' &&
            this.lastOutcome &&
            !this.lastOutcome.isSearching &&
            !this.lastOutcome.isErrorInLastSearch &&
            !this.anySearching &&
            this.searchManager &&
            this.searchManager.last &&
            this.searchManager.last.docType &&
            this.searchManager.last.docType.amount &&
            this.searchManager.last?.docType.score;
  }

  scrollHandler(target: HTMLElement) {
    if (target.offsetWidth < 300) {
      return;
    }
    const left = target.scrollWidth + target.scrollLeft - target.offsetWidth;
    if (left < 100) {
      if (!this.gotMore) {
        this.gotMore = true;
        this.searchManager.getMore();
        this.searchManager.searchResults.pipe(take(2), skip(1)).subscribe(() => {
          this.gotMore = false;
        });
      }
    }
    this.showRightFade = target.scrollLeft < -320;
    this.showLeftFade = this.layout.mobile ? target.scrollLeft === 0 : left > 0;
  }

  titleClicked() {
    this.clicked.emit(true);
  }

  optionClicked(selected: SearchBarType) {
    if (this.docType.filterMenu  && this.docType.filterMenu.length > 0) {
      for (const option of this.docType.filterMenu[0].options) {
        if (option.id === selected.id) {
          this.docType.filterMenu[0].selected = option;
          break;
        }
      }
      this.clicked.emit(true);
    }
  }

  scroll(direction: number, event: Event) {
    const el = this.cards.nativeElement as HTMLElement;
    el.scrollBy({left: 320 * direction, behavior: 'smooth'});
    event?.stopPropagation();
    event?.preventDefault();
  }
}
