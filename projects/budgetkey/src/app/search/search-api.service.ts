import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// import { URL } from './config';
import { SearchResults, SearchParams } from './model';
import { SearchBarType } from '../common-components/components/searchbar/bk-search-bar.component';
import { SearchModule } from './search.module';
import { PlatformService } from '../common-components/platform.service';
// import { SearchBarType } from 'budgetkey-ng2-components';


@Injectable()
export class SearchApiService {

  private cache_: any = {};
  private URL = 'https://next.obudget.org/search';

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
    return this.cache(cacheKey, sp, this.http.get(url, {params: queryParams}) as Observable<SearchResults>);
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


}
