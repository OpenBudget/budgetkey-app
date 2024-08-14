import { Component, Input, OnChanges } from '@angular/core';
import { GlobalSettingsService } from '../../common-components/global-settings.service';

@Component({
  selector: 'app-search-link',
  templateUrl: './search-link.component.html',
  styleUrls: ['./search-link.component.less']
})
export class SearchLinkComponent implements OnChanges {
  @Input() searchQuery: string;
  @Input() searchType: string;

  href = '';

  constructor(private globalSettings: GlobalSettingsService) {}

  ngOnChanges() {
    let base = '//next.obudget.org';
    this.href = `${base}/s/?q=${this.searchQuery}&dd=${this.searchType || 'all'}&theme=${this.globalSettings.themeId}`;
  }

}
