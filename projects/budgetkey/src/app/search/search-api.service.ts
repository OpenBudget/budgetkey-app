import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, from, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

// import { URL } from './config';
import { SearchResults, SearchParams } from '../common-components/search-models';
import { FilterMenu, FilterMenuDynamicOptions, FilterOption, SearchBarType } from '../common-components/components/searchbar/bk-search-bar.component';
import { SearchModule } from './search.module';
import { PlatformService } from '../common-components/platform.service';
// import { SearchBarType } from 'budgetkey-ng2-components';

const DROP_FIELDS = [
  'tenders', 
  'history',
  'explanation',
  'semantic_tags',
  '__date_range_months',
  '__date_range_from',
  '__date_range_to',
];


@Injectable()
export class SearchApiService {

  private cache_: any = {};
  private URL = 'https://next.obudget.org/search';
  private QUERY_URL = 'https://next.obudget.org/api/query';
  private filterOptions_: {[query: string]: Observable<FilterOption[]>} = {};

  constructor(private http: HttpClient, private ps: PlatformService) {}

  cache<T>(cacheKey: string, sp: SearchParams, req: Observable<T>): Observable<T> {
    if (this.cache_[cacheKey]) {
      const ret = this.cache_[cacheKey];
      req = from([this.cache_[cacheKey]]);
    } else if (!sp.term) {
      req = this.ps.cachedRequest(cacheKey, req);
    }

    req = req.pipe(
      map((r: any) => {
        const ret = r as T;
        this.cache_[cacheKey] = ret;
        (ret as any).params = sp;
        return ret;
      })
    );

    return req;
  }

  search(sp: SearchParams): Observable<SearchResults> {
    // const startTime: Date = new Date(); // update time-stamp
    const joinedKinds = sp.docType.types.join(',');

    const url = `${this.URL}/${joinedKinds}`;
    const queryParams: any = {
      size: sp.pageSize,
      offset: sp.offset,
    };
    if (sp.term) {
      queryParams.q = sp.term;
    }
    if (sp.filters) {
      const filters = JSON.stringify(sp.filters);
      queryParams.filter = filters;
    }
    if (sp.ordering) {
      queryParams.order = sp.ordering;
    }
    if (sp.context) {
      queryParams.context = sp.context;
    }

    const cacheKey = `${url}${queryParams.q}${queryParams.filter}${queryParams.order}${queryParams.context}${queryParams.size}${queryParams.offset}`;
    const req: Observable<SearchResults> = this.http.get(url, {params: queryParams}).pipe(
      map((data: any) => {
        const res = data as SearchResults;
        res.search_results.forEach((sr) => {
          for (const f of DROP_FIELDS) {
            if (sr.source.hasOwnProperty(f)) {
              delete sr.source[f];
            }
          }
        });
        return res;
      })
    );
    return this.cache(cacheKey, sp, req);
  }

  count(sp: SearchParams, types: SearchBarType[]): Observable<SearchResults> {
    let url = `${this.URL}/count`;
    const config = types
      .map((t: SearchBarType) => {
        return {
          id: t.id,
          doc_types: t.types,
          filters: t.filters || {}
        };
    });
    let config_key = '';
    config.forEach((c: any) => {
      config_key += c.id + c.doc_types.join(',') + JSON.stringify(c.filters);
    });
    const config_param = JSON.stringify(config);
    const queryParams: any = {
      config: config_param,
    }
    if (sp.term) {
      queryParams.q = sp.term;
    }
    if (sp.context) {
      queryParams.context = sp.context;
    }

    // const cacheKey = url + JSON.stringify(queryParams);
    const cacheKey = `${url}${queryParams.q}${queryParams.context}${config_key}`;
    return this.cache(cacheKey, sp, this.http.get(url, {params: queryParams}) as Observable<SearchResults>);
  }

  // Appends the data-driven options of menus with `dynamicOptions` to their static options.
  // Completes once all menus are populated; synchronously if there's nothing to load.
  resolveFilterMenus(menus: FilterMenu[] | undefined): Observable<void> {
    const pending = (menus || [])
      .filter((menu) => !!menu.dynamicOptions)
      .map((menu) => this.filterOptions(menu.dynamicOptions!).pipe(
        map((options) => {
          const existing = new Set(menu.options.map((o) => o.id));
          menu.options.push(...options.filter((o) => !existing.has(o.id)));
        })
      ));
    if (pending.length === 0 || this.ps.server()) {
      return of(undefined);
    }
    return forkJoin(pending).pipe(map(() => undefined));
  }

  private filterOptions(dynamicOptions: FilterMenuDynamicOptions): Observable<FilterOption[]> {
    const {query, filterField} = dynamicOptions;
    if (!this.filterOptions_[query]) {
      const formData = new FormData();
      formData.append('query', query);
      this.filterOptions_[query] = this.http.post(this.QUERY_URL, formData).pipe(
        map((res: any) => (res.rows || []).map((row: any) => ({
          id: '' + row.id,
          display: row.display,
          filters: {[filterField]: row.id}
        }))),
        catchError((err) => {
          console.error('Failed to load filter options', query, err);
          delete this.filterOptions_[query];  // retry on next search
          return of([]);
        }),
        shareReplay(1)
      );
    }
    return this.filterOptions_[query];
  }


}
