import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BudgetKeyItemService } from '../../../budgetkey-item.service';

@Component({
  selector: 'app-item-soproc-chart',
  templateUrl: './item-soproc-chart.component.html',
  styleUrls: ['./item-soproc-chart.component.less']
})
export class ItemSoprocChartComponent  {
  @Input() public chart: any;
  @Input() public filename: string;

  constructor(private api: BudgetKeyItemService) {}

  download(title: string) {
    const filename = `${this.filename} / מידע על ${title}`;
    if (!this.chart.downloadHeaders) {
      console.log('CCCCC', this.chart);
    }
    const url = this.api.getDownloadUrlPost('xlsx', this.chart.downloadHeaders, filename);
    return url;
  }  
}
