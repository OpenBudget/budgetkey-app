import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chart-spendomat-row',
  templateUrl: './chart-spendomat-row.component.html',
  styleUrls: ['./chart-spendomat-row.component.less']
})
export class ChartSpendomatRowComponent {
  @Input() public row: any;
  @Input() theme: string;
  hoverIndex_ = -1;
  selected = false;

  constructor() {}

  public set hoverIndex( v: number) {
    this.hoverIndex_ = v;
  }

  public get hoverIndex(): number {
    return this.hoverIndex_;
  }
}
