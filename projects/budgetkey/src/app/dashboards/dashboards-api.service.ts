import { Injectable, signal } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { switchMap, debounceTime, map, distinctUntilChanged } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class DashboardsApiService {
  public config: any = {};
  public baseRoute: string[] = [];

  searchQueue = new Subject<any>();
  searchResults = signal<any[]>([]);
  selectedItem = signal<any>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.searchQueue
      .pipe(
        distinctUntilChanged((x, y) => x.term === y.term),
        debounceTime(300),
        switchMap((params) => this.doSearch(params))
      ).subscribe((results: any) => {
        this.searchResults.set(results);
      });
  }

  search(term: string) {
    const doctype = this.config.doctype;
    const filters = this.config.filters;
    console.log('term', term);
    if (term) {
      this.searchQueue.next({term, doctype, filters});
    }
  }

  selectItem(doc_id: string | null) {
    console.log('selectItem', doc_id);
    if (doc_id) {
      doc_id = doc_id?.split('__').join('/');
      const url = `https://next.obudget.org/get/${doc_id}`;
      this.http
        .get(url)
        .subscribe((result: any) => {
          this.selectedItem.set(result.value);
        });
    } else {
      this.selectedItem.set(null);
      this.searchResults.set([]);
    }
  }


  doSearch(params: any) {
    const URL = 'https://next.obudget.org/search';
    let url = `${URL}/${params.doctype}?q=${encodeURIComponent(params.term)}`;
    const filters = JSON.stringify(params.filters).slice(1, -1);
    url += '&filter=' + encodeURIComponent(filters);
    return this.http
      .get(url)
      .pipe(
        map((r: any) => {
          const results: Array<any> = r.search_results || [];
          if (results.length === 1) {
            this.router.navigate([...this.baseRoute, results[0].source.doc_id.split('/').join('__')], {queryParamsHandling: 'preserve'});
          } else {
            if (this.selectedItem()) {
              this.selectedItem.set(null);
              this.searchResults.set([]);        
            }
          }
          return results.map((x) => x.source);
        })
      );
  }

  getParameterPath(object: any, path: string, fallback: string): string {
    return path?.split('.').reduce((o, i) => o?.[i], object) || fallback;
  }

  formatQuery(query: string, parameters: object): string {
    return query.replace(/:([a-z][a-z0-9_.]*)/ig, (match, name) => {
      return this.getParameterPath(parameters, name, match);
    });
  }

  doQuery(query: string, item: any): any {
    query = this.formatQuery(query, item);
    const url = `https://next.obudget.org/api/query?query=${encodeURIComponent(query)}`;
    return this.http
      .get(url)
      .pipe(
        map((r: any) => r.rows)
      );
  }
}
