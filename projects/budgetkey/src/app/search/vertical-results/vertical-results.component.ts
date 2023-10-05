import { Component, OnInit, Input, Inject, HostListener, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SearchState } from '../search-state/search-state';
import { SearchManager, SearchOutcome } from '../search-manager/search-manager';
import { take, skip, first } from 'rxjs/operators';
import { animationFrameScheduler, fromEvent, scheduled, Subscription } from 'rxjs';
import { GlobalSettingsService } from '../../common-components/global-settings.service';
import { SearchApiService } from '../search-api.service';
import { SearchBarType } from '../../common-components/components/searchbar/bk-search-bar.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PlatformService } from '../../common-components/platform.service';

@UntilDestroy()
@Component({
  selector: 'vertical-results',
  templateUrl: './vertical-results.component.html',
  styleUrls: ['./vertical-results.component.less']
})
export class VerticalResultsComponent implements OnInit, OnDestroy {

  @Input() state: SearchState;
  @Input() bare = false;
  @Output() searching = new EventEmitter<boolean>();

  searchManager: SearchManager;

  // Autofetch control
  gotMore = false;
  lastOutcome: SearchOutcome;

  constructor(
    private searchService: SearchApiService,
    private globalSettings: GlobalSettingsService,
    private ps: PlatformService
  ) {
  }

  ngOnInit() {
    this.searchManager = new SearchManager(
      this.searchService,
      this.state,
      <SearchBarType[]>this.globalSettings.theme.searchBarConfig,
      300,
      this
    );

    this.searchManager.searchResults.pipe(
      untilDestroyed(this),
    ).subscribe((outcome) => {
      this.lastOutcome = outcome;
      this.searching.emit(outcome.isSearching);
    });

    this.ps.browser(() => {
      scheduled(fromEvent(window, 'scroll'), animationFrameScheduler).pipe(
        untilDestroyed(this),
      ).subscribe(() => {
        if (window.innerHeight + window.scrollY + 300 > window.document.body.scrollHeight) {
          if (!this.gotMore) {
            this.gotMore = true;
            this.searchManager.getMore();
            this.searchManager.searchResults.pipe(first()).subscribe(() => {
              this.gotMore = false;
            });
          }
        }
      });
    });
  }

  ngOnDestroy() {
  }

  getStatusText() {
    if (!this.lastOutcome) {
      return '';
    } else if (this.lastOutcome.isSearching) {
      return 'טוען&hellip;';
    } else if (this.lastOutcome.isErrorInLastSearch) {
      return 'אירעה שגיאה בחיפוש, נסו שוב';
    } else if (this.searchManager.allResults.length === 0) {
      if (this.state.term) {
        return 'אין תוצאות';
      } else {
        if (this.globalSettings.theme.sampleSearches) {
            return '<b>חיפושים לדוגמה:</b> ' + this.globalSettings.theme.sampleSearches.join(', ') + '&hellip;';
        } else {
          return 'שורת החיפוש ריקה. בצעו חיפוש כלשהו';
        }
      }
    }

    return '';
  }


}
