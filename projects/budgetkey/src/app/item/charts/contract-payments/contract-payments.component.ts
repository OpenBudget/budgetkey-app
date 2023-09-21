import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { format_number } from '../../pipes';

import { scaleLinear, ScaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { max } from 'd3-array';

@Component({
  selector: 'app-contract-payments',
  templateUrl: './contract-payments.component.html',
  styleUrls: ['./contract-payments.component.less']
})
export class ContractPaymentsComponent implements AfterViewInit {
  @Input() public payments: any;
  @ViewChild('container') container: ElementRef;

  HEIGHT = 350;
  TEXT_SIZE = 24;

  private width: number;
  private data: any[];
  private x: ScaleLinear<number, number>;
  private y: ScaleLinear<number, number>;

  constructor() {}

  ngAfterViewInit () {
    this.width = this.container.nativeElement.offsetWidth;
    this.data = this.payments.filter(
      (p: any) => p.selected
    );
    if (this.data.length === 0) { return; }
    const volume = this.data[this.data.length - 1].volume;
    if (volume <= 0) { return; }
    let maxV = max(this.data.map((p: any) => p.executed));
    maxV = max([maxV, volume]);
    this.x = scaleLinear()
             .domain([0, this.data.length])
             .range([0, this.width]);
    this.y = scaleLinear()
             .domain([0, maxV])
             .range([this.HEIGHT - this.TEXT_SIZE, this.TEXT_SIZE]);

    const svg = select(this.container.nativeElement)
              .append('svg')
              .attr('width', this.width + 'px')
              .attr('height', this.HEIGHT + 'px');
    svg.selectAll('.bar-bg')
       .data(this.data, (p: any) => p.timestamp)
       .enter()
       .append('rect')
       .attr('class', 'bar-bg')
       .attr('x', (p, i) => this.x(i))
       .attr('width', (p, i) => (this.x(i + 1) - this.x(i)))
       .attr('y', (p) => this.y(volume))
       .attr('height', (p) => (this.y(0) - this.y(volume)));
    svg.selectAll('.grid')
       .data([0, 25, 50, 75, 100])
       .enter()
       .append('line')
       .attr('class', (d) => 'grid grid-' + d)
       .attr('x1', this.x(0))
       .attr('x2', this.x(this.data.length))
       .attr('y1', (d) => this.y(volume * d / 100))
       .attr('y2', (d) => this.y(volume * d / 100));
    svg.selectAll('.grid-text')
       .data([50, 100])
       .enter()
       .append('text')
       .attr('class', (d) => 'grid-text')
       .attr('x', this.x(0))
       .attr('y', (d) => this.y(volume * d / 100))
       .attr('dy', 12)
       .text((d) => d + '%');
    svg.selectAll('.bar-executed')
       .data(this.data, (p: any) => p.timestamp)
       .enter()
       .append('rect')
       .attr('class', 'bar-executed')
       .attr('x', (p, i) => this.x(i))
       .attr('width', (p, i) => (this.x(i + 1) - this.x(i)))
       .attr('y', (p) => this.y(p.executed))
       .attr('height', (p) => (this.y(0) - this.y(p.executed)));
    svg.selectAll('.bar-diff')
       .data(this.data, (p: any) => p.timestamp)
       .enter()
       .append('rect')
       .attr('class', 'bar-diff')
       .attr('x', (p, i) => this.x(i))
       .attr('width', (p, i) => (this.x(i + 1) - this.x(i)))
       .attr('y', (p) => this.y(p.executed))
       .attr('height', (p) => (this.y(p.executed - p.diff) - this.y(p.executed)));
    svg.selectAll('.text-year')
       .data(this.data, (p: any) => p.timestamp)
       .enter()
       .append('text')
       .attr('class', 'text-year')
       .attr('x', (p, i) => this.x(i))
       .attr('y', (p) => this.y(0))
       .attr('dy', this.TEXT_SIZE)
       .text((p) => p.period === '1' ? p.year : null);
    select(this.container.nativeElement).append('span')
       .attr('class', 'text-amount')
       .style('left', this.x(this.data.length - 1) + 'px')
       .style('top',
              (p) => (this.y(this.data[this.data.length - 1].executed) - this.TEXT_SIZE) + 'px')
       .style('width', (p) => (this.x(1) - this.x(0)) + 'px')
       .html((p) => format_number(this.data[this.data.length - 1].executed) + '₪');
  }
}
