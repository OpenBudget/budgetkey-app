import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { ReplaySubject, first, timer } from 'rxjs';
import { PlatformService } from '../../common-components/platform.service';
import { PlotlyService } from './plotly.service';

@Component({
  selector: 'app-chart-plotly',
  templateUrl: './chart-plotly.component.html',
  styleUrls: ['./chart-plotly.component.less'],
  host: {
    '[class.enlarged]': 'enlarged'
  }
})
export class ChartPlotlyComponent implements OnChanges, AfterViewInit {

  @Input() public data: any;
  @Input() public layout: any;
  @Input() public config: any = {};

  @ViewChild('plot') plot: ElementRef;
  @ViewChild('wrapper') wrapper: ElementRef;

  ready = false;

  _enlarged = false;

  constructor(private ps: PlatformService, private plotly: PlotlyService) {
  }

  ngAfterViewInit() {
    this.ready = true;
    this.draw();
  }

  ngOnChanges() {
    if (this.ready) {
      this.draw();
    }
  }

  draw(big?: boolean) {
    if (this.ps.server()) {
      return;
    }
    const wrapper = this.wrapper.nativeElement as HTMLDivElement;
    const el = this.plot.nativeElement as HTMLDivElement;
    const layout = Object.assign({
      height: 600,
      font: {
        size: 10
      }
    }, this.layout);
    if (wrapper.offsetWidth < 500) {
      layout.legend = Object.assign({orientation: 'h'}, layout.legend || {});
      layout.margin = Object.assign({b:50, l:50, r:0, t:40}, layout.margin || {});
    }
    if (big) {
      layout.height = wrapper.offsetHeight - 80;
      layout.width = wrapper.offsetWidth - 80;
    }

    el.innerHTML = '';
    this.plotly.newPlot(el, this.data, layout, Object.assign({responsive: true}, this.config));
    el.querySelectorAll('svg').forEach((svg) => {
      svg.setAttribute('alt', this.data.title || 'diagram');
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', this.data.title || 'diagram');
    });
  }

  set enlarged(value: boolean) {
    this._enlarged = value;
    this.ps.browser(() => {
      timer(0).subscribe(() => {
        this.draw(value);
      });
    });
  }

  get enlarged(): boolean {
    return this._enlarged;
  }
}

