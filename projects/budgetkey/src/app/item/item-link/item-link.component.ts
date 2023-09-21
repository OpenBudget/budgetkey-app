import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GlobalSettingsService } from '../../common-components/global-settings.service';

@Component({
  selector: 'app-item-link',
  templateUrl: './item-link.component.html',
  styleUrls: ['./item-link.component.less']
})
export class ItemLinkComponent implements OnChanges {
  @Input() itemId: string;

  href = '';

  constructor(private globalSettings: GlobalSettingsService) {}

  ngOnChanges() {
    let base = '//next.obudget.org';
    if (this.itemId.indexOf('activities/gov_social_service') === 0) {
      base = '//www.socialpro.org.il';
    }
    this.href = `${base}/i/${this.itemId}?theme=${this.globalSettings.themeId}`;
  }
}