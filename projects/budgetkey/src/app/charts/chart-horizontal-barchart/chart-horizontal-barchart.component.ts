import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalSettingsService } from '../../common-components/global-settings.service';

@Component({
    selector: 'app-chart-horizontal-barchart',
    templateUrl: './chart-horizontal-barchart.component.html',
    styleUrls: ['./chart-horizontal-barchart.component.less'],
    standalone: false
})
export class ChartHorizontalBarchartComponent {
  @Input() public data: any;
  maxValue = 1;

  constructor(private router: Router, private globalSettings: GlobalSettingsService) {
  }

  ngOnInit() {
    for (const v of this.data.values) {
      if (v.value > this.maxValue) {
        this.maxValue = v.value;
      }
      v.label = v.label.replace('theme=budgetkey', 'theme=' + this.globalSettings.themeId);
    }
    this.maxValue *= 1.15;
  }

  onSelected(context: any) {
    this.router.navigate(['/i', context], { queryParamsHandling: 'merge', queryParams: {theme: this.globalSettings.themeId} });
  }
}
