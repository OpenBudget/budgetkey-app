import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MushonKeyChart, MushonKeyFlow, MushonKeyFlowGroup } from 'mushonkey';
import { select as d3Select } from 'd3-selection';
import { Router } from '@angular/router';
import { delay, tap, timer } from 'rxjs';

@Component({
    selector: 'app-chart-mushonkey',
    templateUrl: './chart-mushonkey.component.html',
    styleUrls: ['./chart-mushonkey.component.less'],
    standalone: false
})
export class ChartMushonkeyComponent {
  @Input() public data: any;

  @ViewChild('mushonkey') mushonkey: ElementRef;

  mushonkeyChart: MushonKeyChart;
  chartHeight: string;

  constructor(private router: Router) {
  }

  onSelected(context: any) {
    const parts = context.split('/');
    this.router.navigate(['/i', ...parts], { queryParamsHandling: 'preserve' });
  }

  ngOnInit() {
    this.chartHeight = this.data.height;
    timer(0).pipe(
      tap(() => {
        const groups: Array<MushonKeyFlowGroup> = [];
        for (const group of this.data.groups) {
          const flows: Array<MushonKeyFlow> = [];
          for (const flow of group.flows) {
            flows.unshift(new MushonKeyFlow(flow.size, flow.label, flow.context));
          }

          const mkfg = new MushonKeyFlowGroup(group.leftSide, flows, group.class, group.offset, group.width, group.slope, group.roundness);
          mkfg.labelTextSize = group.labelTextSize;
          groups.push(mkfg);
        }
        this.mushonkeyChart = new MushonKeyChart(
          groups,
          this.data.centerTitle,
          this.data.centerWidth,
          this.data.centerHeight,
          this.data.directionLeft
        );
      }),
      delay(0),
      tap(() => {
        const svg = d3Select(this.mushonkey.nativeElement).select('svg');
        const lg = svg.append('defs')
                      .append('linearGradient')
                      .attr('id', 'centerPiece');
        lg.append('stop')
          .attr('stop-color', 'lightblue')
          .attr('offset', '10%');
        lg.append('stop')
          .attr('stop-color', '#E4DCF5')
          .attr('offset', '100%');

      })
    ).subscribe();
  }

}
