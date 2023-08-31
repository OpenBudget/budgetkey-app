import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// import { URL } from './config';
import { SearchResults, SearchParams } from './model';
import { SearchBarType } from '../common-components/components/searchbar/bk-search-bar.component';
import { SearchModule } from './search.module';
// import { SearchBarType } from 'budgetkey-ng2-components';


@Injectable()
export class SearchApiService {

  private cache: any = {};
  private URL = 'https://next.obudget.org/search';

  constructor(private http: HttpClient) {}

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

    const cacheKey = url + JSON.stringify(queryParams);
    if (this.cache[cacheKey]) {
      const ret = this.cache[cacheKey];
      ret.params = sp;
      return of(this.cache[cacheKey]);
    }

    return this.http
      .get(url, {params: queryParams})
      .pipe(
        map((r: any) => {
          const ret = <SearchResults>r;
          this.cache[cacheKey] = ret;
          ret.params = sp;
          return ret;
        }),
      );
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

    const cacheKey = url + JSON.stringify(queryParams);
    if (this.cache[cacheKey]) {
      const ret = this.cache[cacheKey];
      ret.params = sp;
      return of(this.cache[cacheKey]);
    }

    return this.http
      .get(url, {params: queryParams})
      .pipe(
        map((r: any) => {
          const ret = <SearchResults>r;
          this.cache[cacheKey] = ret;
          ret.params = sp;
          return ret;
        })
      );
  }


}
