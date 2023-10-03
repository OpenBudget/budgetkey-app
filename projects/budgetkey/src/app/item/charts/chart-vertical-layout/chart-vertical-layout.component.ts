import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chart-vertical-layout',
  templateUrl: './chart-vertical-layout.component.html',
  styleUrls: ['./chart-vertical-layout.component.less']
})
export class ChartVerticalLayoutComponent {
  @Input() item: any;
  @Input() public data: any;
}
