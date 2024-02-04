import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from './model';
import { Format } from '../format';
import { GlobalSettingsService } from '../common-components/global-settings.service';

@Injectable()
export class BudgetKeyItemService {
  format = new Format();
  constructor(private http: HttpClient, private globalSettings: GlobalSettingsService) {}

  getRedashUrl(query: string): string {
    // TODO: Implement
    return '//next.obudget.org/api/query?query=' +
      encodeURIComponent(query);
  }


  getDownloadUrlPost(format: string, headers: string[], fileName: string): string {
    return 'https://next.obudget.org/api/download?' +
      'format=' + format +
      '&filename=' + encodeURIComponent(fileName) +
      '&headers=' + encodeURIComponent(headers.join(';'));
  }

  getDownloadUrl(query: string, format: string, headers: string[], fileName: string): string {
    query = query.split(/\s+/).join(' ');
    return '//next.obudget.org/api/download?query=' + encodeURIComponent(query) +
      '&format=' + format +
      '&filename=' + encodeURIComponent(fileName) +
      '&headers=' + encodeURIComponent(headers.join(';'));
  }

  getItem(itemId: string): Observable<Item> {
    const url = 'https://next.obudget.org/get/' + itemId;
    return this.http.get(url)
        .pipe(
          map((res: any) => res.value)
        );
  }

  private _budgetNumberFormatter(value: any) {
    value = parseFloat(value);

    return isFinite(value)
      ? this.format.number(value)
      : '-';
  }

  private _budgetLinkFormatter(value: string) {
    if (!value) {
      return '';
    }
    return '<a href="' + value + '">קישור</a>';
  }

  private _budgetLinkTitleFormatter(value: string) {
    if (!value) {
      return '';
    }
    const parts = value.split('#', 2);
    if (parts.length < 2) {
      return value;
    }
    return '<a href="' + parts[0] + '">' + parts[1] + '</a>';
  }

  private _budgetItemTitleFormatter(value: string) {
    if (!value) {
      return '';
    }
    const parts = value.split('#', 2);
    if (parts.length < 2) {
      return value;
    }

    return '<a href="https://next.obudget.org/i/' + parts[0]
      + (this.globalSettings.themeId ? '?theme=' + this.globalSettings.themeId : '') +
      '">' + parts[1] + '</a>';
  }

  private _budgetSearchTitleFormatter(value: string) {
    if (!value) {
      return '';
    }
    const parts = value.split('#', 3);
    if (parts.length < 3) {
      return value;
    }
    return '<a href="https://next.obudget.org/s?q=' +
      encodeURIComponent(parts[0]) + '&dd=' + encodeURIComponent(parts[1]) +
        (this.globalSettings.themeId ? '&theme=' + this.globalSettings.themeId : '') + '">' + parts[2] + '</a>';
  }

  getItemData(query: string, headersOrder: string[], formatters: any[], page = 0, pageSize?: number): Observable<object> {
    const params: any = {
      page
    };
    let url = 'https://next.obudget.org/api/query';
    if (!!pageSize) {
      params['page_size'] = pageSize;
    }
    const formData = new FormData();
    formData.append('query', query);
    return this.http.post(url, formData, {params})
        .pipe(
          map(
            (res: any) => {
              const items: object[] = [];
              const rows = res.rows || [];
              const total = res.total;
              const pages = res.pages;
              const page = res.page;
              const headers = headersOrder;
              const error = res.error;

              rows.forEach((row: any) => {
                const newItem: any[] = [];

                formatters.forEach((formatter: any) => {
                  const item = formatter(row);
                  newItem.push(item);
                });
                items.push(newItem);
              });
              return {query, headers, items, total, rows, error, pages, page};
            }),
        );
  }

  getDatarecords(kind: string) {
    return this.http.get(`https://data-input.obudget.org/api/datarecords/${kind}`)
      .pipe(
        map((result: any) => {
          return result.result.map((x: any) => x.value);
        })
      );
  }
}
