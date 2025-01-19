import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { SEARCHES_LIST } from '../../common-components/constants';
import { HttpClient } from '@angular/common/http';
import { ListItem, ListsService } from '../../common-components/services/lists.service';
import { GlobalSettingsService } from '../../common-components/global-settings.service';

@Component({
    selector: 'app-single-subscription-item',
    templateUrl: './single-subscription-item.component.html',
    styleUrls: ['./single-subscription-item.component.less'],
    standalone: false
})
export class SingleSubscriptionItemComponent implements OnInit {

  @Input() item: ListItem;
  @Output() changed = new EventEmitter<any>();

  sharing = false;
  total_results: number | null = null;

  constructor(private http: HttpClient,
              private lists: ListsService,
              private globalSettings: GlobalSettingsService) {}

  ngOnInit() {
    this.getCurrentResultNum();
    if (this.globalSettings.themeId) {
      let search = this.item.url.split('?')[1];
      if (search) {
        const params = new URLSearchParams(search);
        if (!params.get('theme')) {
          params.set('theme', this.globalSettings.themeId);
          search = params.toString();
          this.item.url = this.item.url.split('?')[0] + '?' + search;
        }
      }
    }
  }

  docType() {
    const p = this.item.properties;
    return (p.docType && p.docType.id) || p.displayDocs;
  }

  docTypeTypes() {
    const p = this.item.properties;
    return (p.docType && p.docType.types) || p.displayDocsTypes;
  }

  docTypeDisplay() {
    const p = this.item.properties;
    return (p.docType && p.docType.name) || p.displayDocsDisplay;
  }

  filters() {
    const p = this.item.properties;
    return (p.docType && p.docType.filters) || p.filters || {};
  }

  timeRange() {
    const p = this.item.properties;
    return (p.period && p.period.value) || p.timeRange || 'alltime';
  }

  timeRangeDisplay() {
    const p = this.item.properties;
    return (p.period && p.period.title) || p.timeRangeDisplay || '';
  }

  timeRangeStart() {
    const p = this.item.properties;
    return (p.period && p.period.start) || p.startRange || '1900-01-01';
  }

  timeRangeEnd() {
    const p = this.item.properties;
    return (p.period && p.period.end) || p.endRange || '2100-12-31';
  }

  getCurrentResultNum() {
    const URL = 'https://next.obudget.org/search';
    const p = this.item.properties;
    const config = [
      {
        id: this.docType(),
        doc_types: this.docTypeTypes(),
        filters: this.filters()
      }
    ];
    const config_param = encodeURIComponent(JSON.stringify(config));
    this.http
        .get(`${URL}/count?q=${encodeURIComponent(p.term)}&&config=${config_param}`)
        .subscribe((ret: any) => {
          if (ret.search_counts) {
            const counts = ret.search_counts[this.docType()];
            if (counts) {
              this.total_results = counts.total_overall;
            }
          }
        });
  }

  delete() {
    if (Number.isFinite(this.item.id)) {
      const id = this.item.id as number;
      this.lists.delete(SEARCHES_LIST, id)
      .subscribe((_) => {
        this.changed.emit(null);
      });
    }
  }

  share() {
    this.sharing = !this.sharing;
  }

  navigate() {
    window.location.href = this.item.url;
  }
}
