import { Component, Input, OnInit } from '@angular/core';
import { GlobalSettingsService } from '../../common-components/global-settings.service';

@Component({
    selector: 'app-chart-adamkey',
    templateUrl: './chart-adamkey.component.html',
    styleUrls: ['./chart-adamkey.component.less'],
    standalone: false
})
export class ChartAdamkeyComponent implements OnInit  {

  @Input() data: any;

  constructor(private globalSettings: GlobalSettingsService) {
  }

  ngOnInit() {
    for (const v of this.data.values) {
      v.label = v.label.replace('theme=budgetkey', 'theme=' + this.globalSettings.themeId);
    }
  }

}
