import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BudgetKeyItemService } from '../../../../budgetkey-item.service';
import { GlobalSettingsService } from '../../../../../common-components/global-settings.service';

@Component({
    selector: 'app-social-service-data-table',
    templateUrl: './social-service-data-table.component.html',
    styleUrls: ['./social-service-data-table.component.less'],
    standalone: false
})
export class SocialServiceDataTableComponent implements OnInit, OnChanges {

  @Input() item: any;
  @Input() tables: any;
  @Input() replacements: any[];
  @Input() default: string;
  @Input() filename: string;
  public _currentTable: any;
  public _tableKeys: string[] = [];

  constructor(private api: BudgetKeyItemService, private globalSettings: GlobalSettingsService) {
  }

  ngOnChanges() {
    this._tableKeys = Object.keys(this.tables);
    this.refresh();
  }

  ngOnInit() {
    this._currentTable = this.tables[this.default];
  }

  refresh() {
    for (const tbl of Object.keys(this.tables)) {
      this.refreshTable(this.tables[tbl]);
    }
  }

  refreshTable(tbl: any) {
    if (!tbl.query) {
        return;
    }
    let query = this.replaceAll(
      tbl.query, this.replacements.concat([
        {from: ':fields', to: tbl.fields.join(', ')},
        {from: ':only-active', to: tbl.onlyActive ? 'TRUE' : 'FALSE'}
      ])
    );
    if (!tbl.actualQuery || tbl.actualQuery !== query) {
      tbl.actualQuery = query;
      tbl.currentPage = 0;
    }
    if (tbl.sortField) {
      if (tbl.sortDirectionDesc) {
        query = query + ` ORDER BY ${tbl.sortField} DESC NULLS LAST`
      } else {
        query = query + ` ORDER BY ${tbl.sortField} ASC NULLS LAST`
      }
    }
    const formatters: any[] = [];
    tbl.fields.forEach((f: string) => {
      formatters.push(this.formatter(f));
    });
    this.api.getItemData(
      query, tbl.fields, formatters, tbl.currentPage, 100
    ).subscribe((result: any) => {
      tbl.rows = result.rows;
      if (result.error) {
        console.log('ERROR', query, result.error);
      }  
      tbl.currentPage = result.page;
      tbl.totalPages = result.pages;
      tbl.totalRows = result.total;
    });      
  }

  set currentTable(value) {
    if (value !== this._currentTable) {
      this._currentTable = value;
      this._currentTable.sortField = this._currentTable.sortField || this._currentTable.sorting[0];
    }      
  }
  
  get currentTable() {
    return this._currentTable;
  }

  sortBy(field: string) {
    if (this._currentTable.sortField !== field) {
      this._currentTable.sortField = field;
      this._currentTable.sortDirectionDesc = false;
    } else {
      if (this._currentTable.sortDirectionDesc === false) {
        this._currentTable.sortDirectionDesc = true;
      } else {
        this._currentTable.sortField = null;
      }
    }
    this.refreshTable(this._currentTable);
  }
  
  movePage(by: number) {
    const current = this.currentTable.currentPage;
    this.currentTable.currentPage += by;
    this.currentTable.currentPage = Math.max(this.currentTable.currentPage, 0);
    this.currentTable.currentPage = Math.min(this.currentTable.currentPage, this.currentTable.totalPages - 1);
    if (current !== this.currentTable.currentPage) {
      this.refreshTable(this._currentTable);
    }
  }
  
  download() {
    const filename = `${this.filename} / מידע על ${this.currentTable.name}`;
    const url = this.api.getDownloadUrlPost('xlsx', this.currentTable.downloadHeaders, filename)
    return url;
  }
  
  downloadReportUrl() {
    const url = `https://next.obudget.org/datapackages/reports/services/שירותים חברתיים - ${this.item.office}.xlsx`;
    return url;
  }

  replaceAll(query: string, conf: any[]) {
    for (const {from, to} of conf) {
      query = query.split(from).join(to);
    }
    return query;
  }

  formatter(f: string) {
    return (row: any) => '' + row[f];
  }

  hasActive() {
    return this.currentTable.sorting.indexOf('active') >= 0;
  }

  doSearch(href?: string) {
    const themeId = this.globalSettings.theme.themeId;
    let _href = href || `https://next.obudget.org/s/?theme=${themeId}&lang=${this.globalSettings.lang}`;
    console.log('doSearch', _href);
    window.open(_href, '_blank');
  }  
}
