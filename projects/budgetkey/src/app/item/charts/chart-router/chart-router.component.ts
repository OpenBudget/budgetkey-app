import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chart-router',
  templateUrl: './chart-router.component.html',
  styleUrls: ['./chart-router.component.less']
})
export class ChartRouterComponent {
  @Input() public item: any;
  @Input() public chart: any;

  orgCredentialsPath() {
    const rad = Math.PI * this.item.details.pct_proper_management_in_field_of_activity / 50;
    const large = this.item.details.pct_proper_management_in_field_of_activity >= 50;
    let ret = 'M 75 0 A 75 75 0 ';
    ret += large ? '1' : '0';
    ret += ' 1 ';
    ret += 75 * (1 + Math.sin(rad));
    ret += ' ';
    ret += 75 * (1 - Math.cos(rad));
    ret += ' L 75 75';
    return ret;
  }
}
