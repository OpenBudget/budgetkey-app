import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, from, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

// import { URL } from './config';
import { SearchResults, SearchParams } from '../common-components/search-models';
import { FilterMenu, FilterMenuDynamicOptions, FilterOption, SearchBarType } from '../common-components/components/searchbar/bk-search-bar.component';
import { SearchModule } from './search.module';
import { PlatformService } from '../common-components/platform.service';
import { ANALYSIS_CATEGORIES } from '../common-components/analysis-categories';
import { mergeFilters } from './search-state/search-state';

// Label maps that filter menus can use as `dynamicOptions.labels`
const FILTER_OPTION_LABELS: {[name: string]: {[id: string]: string}} = {
  'analysis-categories': ANALYSIS_CATEGORIES,
};
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

  // Appends the data-driven options of a doc type's menus with `dynamicOptions` to their static options.
  // Completes once all menus are populated; synchronously if there's nothing to load.
  // Also runs on the server, so that a filter selected in the URL applies to the server-rendered results.
  resolveFilterMenus(docType: SearchBarType): Observable<void> {
    const pending = (docType.filterMenu || [])
      .filter((menu) => !!menu.dynamicOptions)
      .map((menu) => this.filterOptions(menu.dynamicOptions!, docType).pipe(
        map((options) => {
          const existing = new Set(menu.options.map((o) => o.id));
          menu.options.push(...options.filter((o) => !existing.has(o.id)));
        })
      ));
    if (pending.length === 0) {
      return of(undefined);
    }
    return forkJoin(pending).pipe(map(() => undefined));
  }

  private filterOptions(dynamicOptions: FilterMenuDynamicOptions, docType: SearchBarType): Observable<FilterOption[]> {
    const {query, labels, filterField} = dynamicOptions;
    const cacheKey = query || `${labels}:${docType.types.join(',')}:${filterField}`;
    if (!this.filterOptions_[cacheKey]) {
      const values = query ? this.queryValues(query) : this.labelValues(labels!, docType, filterField);
      this.filterOptions_[cacheKey] = values.pipe(
        map((rows) => rows.map((row) => ({
          id: '' + row.id,
          display: row.display,
          filters: {[filterField]: row.id}
        }))),
        catchError((err) => {
          console.error('Failed to load filter options', cacheKey, err);
          delete this.filterOptions_[cacheKey];  // retry on next search
          return of([]);
        }),
        shareReplay(1)
      );
    }
    return this.filterOptions_[cacheKey];
  }

  private queryValues(query: string): Observable<{id: any, display: string}[]> {
    return this.http.get(this.QUERY_URL, {params: {query}}).pipe(
      map((res: any) => res.rows || [])
    );
  }

  // The label map's values that have any results for this doc type, in the map's order
  private labelValues(labels: string, docType: SearchBarType, filterField: string): Observable<{id: any, display: string}[]> {
    const entries = Object.entries(FILTER_OPTION_LABELS[labels] || {});
    const config = entries.map(([id]) => ({
      id,
      doc_types: docType.types,
      filters: mergeFilters(docType.filters, {[filterField]: id})
    }));
    return this.http.get(`${this.URL}/count`, {params: {config: JSON.stringify(config)}}).pipe(
      map((res: any) => entries
        .filter(([id]) => res.search_counts?.[id]?.total_overall > 0)
        .map(([id, display]) => ({id, display}))
      )
    );
  }


}
