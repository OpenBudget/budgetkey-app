import { Subject, of, BehaviorSubject, Observable, from, merge, empty, EMPTY, ReplaySubject } from 'rxjs';
import { SearchParams, SearchResults, DocResultEntry } from '../../common-components/search-models';
import { debounceTime, switchMap, mergeMap, filter, map, last, tap, catchError } from 'rxjs/operators';
import { SearchState } from '../search-state/search-state';
import { SearchApiService } from '../search-api.service';
import { SearchBarType } from '../../common-components/components/searchbar/bk-search-bar.component';
import { untilDestroyed } from '@ngneat/until-destroy';
import { OnDestroy } from '@angular/core';


export class SearchOutcome {
  constructor(
    public docs: DocResultEntry[],
    public isSearching: boolean,
    public isErrorInLastSearch: boolean) {
    
  }
}
  
  
export class SearchManager {
    
  // Fetch more
  private moreQueue = new Subject<SearchParams>();
  public done = false;
  public last: SearchParams = new SearchParams();
  
  // Results
  allResults: DocResultEntry[] = [];
  searchResults = new ReplaySubject<SearchOutcome>(1);
  
  constructor(private api: SearchApiService,
    private state: SearchState,
    private docTypes: SearchBarType[],
    private debounce: number,
    private component: OnDestroy,
    modifyParams?: (sp: SearchParams) => SearchParams
  ) {
      
    if (!modifyParams) {
      modifyParams = (sp) => sp;
    }
    merge(this.moreQueue, state.searchQueue) // open a stream
    .pipe(
      untilDestroyed(this.component),
      filter((sp) => !!sp),
      map((sp) => {
        if (modifyParams) {
          sp = modifyParams(sp);
        }
        this.last = sp;
        return sp;
      }),
      debounceTime(this.debounce),           // wait for 300ms pause in events
      switchMap((sp: SearchParams) => {
        return this.doRequest(sp);
      }),
      switchMap((results: SearchResults) => {
        return this.processResults(results);
      }),
      switchMap((results: SearchResults) => {
        return this.processResults(results);
      }),
      catchError((err) => {
        this.updateResults([], false, true);
        console.log('Error while searching:', err);
        return EMPTY;
      })
      )
      .subscribe();
  }
      
  getMore() {
    if (!this.done) {
      this.last.offset = this.allResults.length;
      this.last.pageSize = 10;
      this.moreQueue.next(this.last);
    }
  }
  
  updateResults(results: any[], isSearching: boolean, isErrorInLastSearch?: boolean) {
    this.allResults = results;
    const outcome = new SearchOutcome(
      results, isSearching, !!isErrorInLastSearch
    );
    this.searchResults.next(outcome);
  }
    
  doRequest(sp: SearchParams): Observable<SearchResults> {
    // Do actual request
    if (sp.offset === 0) {
      this.updateResults([], true);
    }
    return this.api.search(sp);    
  }
    
  doCountRequest(sp: SearchParams): Observable<any> {
    const toCount = this.docTypes.filter((dt: any) => dt !== sp.docType);
    if (toCount.length > 0) {
      return this.api.count(sp, toCount);
    }
    return from([]);
  }
    
  processResults(results: SearchResults) {
    if (results && results.params) {
      if (results.search_counts) {
        for (let key of Object.keys(results.search_counts)) {
          const count = (results.search_counts as any)[key].total_overall;
          if (key === '_current') {
            key = results.params.docType.id;
            this.done = (results.params.offset + results.search_results.length) >= count;
          }
          for (const dt of this.docTypes) {
            if (dt.id === key) {
              dt.amount = count;
              break;
            }
          }
        }
      }
      if (results.search_results) {
        this.allResults = this.allResults.slice(0, results.params.offset);
        this.allResults.push(...results.search_results);
        this.updateResults(this.allResults, results.params !== this.last);
        if (this.allResults.length && results?.params?.offset === 0) {
          return this.doCountRequest(results.params);
        }
      }
    }
    return from([]);
  }
    
}
      