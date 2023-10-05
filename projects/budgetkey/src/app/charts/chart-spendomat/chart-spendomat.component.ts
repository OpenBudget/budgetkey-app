import { Component, Input, OnInit } from '@angular/core';
import { Format } from '../../format';

@Component({
  selector: 'app-chart-spendomat',
  templateUrl: './chart-spendomat.component.html',
  styleUrls: ['./chart-spendomat.component.less']
})
export class ChartSpendomatComponent implements OnInit {

  @Input() public data: any;

  rows: any[] = [];

  format = new Format();

  constructor() {}

  ngOnInit() {
    const data = this.data.data;
    this.rows = data;
    let sum = 0;
    this.rows.forEach((r) => {
      sum += r['amount'];
    });
    this.rows.forEach(
      (r) => {
        r['amount_fmt'] = this.format.number(r['amount']) + ' ₪';
        const width = 100 * r['amount'] / sum;
        let acc = 0;
        r['spending'].forEach((s: any) => {
          s['amount_fmt'] = this.format.number(s['amount']) + ' ₪';
          const s_width = s['amount'] / r['amount'];
          acc += s_width * width;
          s['acc_width'] = acc;
          s['width'] = s_width * 100;

          let inner_acc = 0;
          s['amount_widths'] = s['amounts'].map((a: number) => {
            const inner_w = a / s['amount'];
            inner_acc += inner_w;
            return inner_acc * s['width'];
          });
          s['amount_widths'].reverse();
        });
      }
    );
  }

}
