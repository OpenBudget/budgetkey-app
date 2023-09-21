import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Item } from '../../item/model';

@Component({
  selector: 'app-item-visualizations',
  templateUrl: './item-visualizations.component.html',
  styleUrls: ['./item-visualizations.component.less']
})
export class ItemVisualizationsComponent implements OnChanges {

  @Input() item: Item;

  public current: any = null;
  public currentSub: any = null;

  public charts: any = [];
  public subcharts: any = null;
  public chart_: any = null;

  constructor() {
  }

  ngOnChanges() {
    this.updateItem();
  }

  updateItem() {
    this.charts = {};
    this.current = null;
    this.charts = this.item.charts;
    if (this.charts && this.charts.length > 0) {
      this.showTab(this.charts[0]);
    }
  }

  showTab(selectedChart: any) {
    if (this.current === selectedChart) {
      return;
    }
    this.current = selectedChart;
    if (this.current.subcharts) {
      this.subcharts = this.current.subcharts;
      this.currentSub = this.current.subcharts[0];
      this.chart = this.currentSub;
    } else {
      this.chart = selectedChart;
      this.subcharts = null;
      this.currentSub = null;
    }
  }

  showSubTab(subtab: any) {
    this.currentSub = subtab;
    this.chart = this.currentSub;
  }

  public set chart(chart: any) {
    this.chart_ = chart;
  }

  public get chart(): any {
    return this.chart_;
  }

  tabsScroll(event: any) {
    const center = event.target.offsetWidth / 2;
    const scrollCenter = -event.target.scrollLeft + center;
    const itemWidth = event.target.scrollWidth / this.charts.length;
    const visibleItem = Math.floor(scrollCenter / itemWidth);
    this.showTab(this.charts[visibleItem]);
  }
}