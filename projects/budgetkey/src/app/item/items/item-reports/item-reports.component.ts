import { Component, Input, OnChanges } from '@angular/core';
import { GlobalSettingsService } from '../../../common-components/global-settings.service';
import { Indicator, Question } from '../../model';
import { ItemApiService } from '../../item-api.service';

@Component({
    selector: 'app-item-reports',
    templateUrl: './item-reports.component.html',
    styleUrls: ['./item-reports.component.less'],
    standalone: false
})
export class ItemReportsComponent implements OnChanges {
  @Input() item: any;
  @Input() questions: Question[];

  @Input() titleOtherURLPrefix: string;
  @Input() titleField: string;
  @Input() titleSuffix: string;
  @Input() indicators: Indicator[];

  dropdownHidden = true;
  selectedIndicator = 0;

  constructor(private globalSettings: GlobalSettingsService, private itemApi: ItemApiService) {}
  
  ngOnChanges() {
    this.itemApi.setQuestions(this.questions);
  }

  href(other: string) {
    let href = '/i/' +
      this.titleOtherURLPrefix +
      other;
    if (this.globalSettings.themeId) {
      href += '?theme=' +
        this.globalSettings.themeId;
    }
    return href;
  }

  nextIndicator() {
    const l = this.indicators.length;
    this.selectedIndicator = (this.selectedIndicator + l + 1) % l;
  }

  prevIndicator() {
    const l = this.indicators.length;
    this.selectedIndicator = (this.selectedIndicator + l - 1) % l;
  }

}
