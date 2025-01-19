import { Component, Input } from '@angular/core';
import { GlobalSettingsService } from 'projects/budgetkey/src/app/common-components/global-settings.service';

@Component({
    selector: 'app-muni-budget-minicard',
    templateUrl: './muni-budget-minicard.component.html',
    styleUrls: ['./muni-budget-minicard.component.less'],
    standalone: false
})
export class MuniBudgetMinicardComponent {
  @Input() item: any;
  @Input() entry: any;

  constructor(private globalSettings: GlobalSettingsService) {}

  public get href() {
    return `/i/muni_budgets/${this.item.muni_code}/${this.entry.code}/${this.item.year}?theme=${this.globalSettings.themeId}`;
  }

}
