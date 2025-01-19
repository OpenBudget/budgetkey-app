import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-chart-comparatron',
    templateUrl: './chart-comparatron.component.html',
    styleUrls: ['./chart-comparatron.component.less'],
    standalone: false
})
export class ChartComparatronComponent implements OnInit {

  @Input() public data: any;

  HEIGHT = 250;
  TEXT_SIZE = 24;

  constructor() {}

  ngOnInit() {
    const max_num =
      this.data.compare.amount > this.data.main.amount ?
          this.data.compare.amount : this.data.main.amount;
    const scale = max_num / (this.HEIGHT - 20);
    this.data.main['height'] = this.data.main.amount / scale;
    this.data.main['top'] = this.HEIGHT - this.TEXT_SIZE - this.data.main['height'];
    this.data.compare['top'] = this.HEIGHT -  this.data.compare.amount / scale;
  }

}
