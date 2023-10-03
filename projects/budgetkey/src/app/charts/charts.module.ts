import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdamkeyModule } from 'adamkey';
import { MushonkeyModule } from 'mushonkey';
import { ChartAdamkeyComponent } from './chart-adamkey/chart-adamkey.component';
import { ChartComparatronComponent } from './chart-comparatron/chart-comparatron.component';
import { ChartHorizontalBarchartComponent } from './chart-horizontal-barchart/chart-horizontal-barchart.component';
import { ChartMushonkeyComponent } from './chart-mushonkey/chart-mushonkey.component';
import { ChartPlotlyComponent } from './chart-plotly/chart-plotly.component';
import { ChartPointatronComponent } from './chart-pointatron/chart-pointatron.component';
import { ChartSpendomatRowComponent } from './chart-spendomat/chart-spendomat-row/chart-spendomat-row.component';
import { ChartSpendomatComponent } from './chart-spendomat/chart-spendomat.component';



@NgModule({
  declarations: [
    ChartPlotlyComponent,
    ChartMushonkeyComponent,
    ChartHorizontalBarchartComponent,
    ChartPointatronComponent,
    ChartComparatronComponent,
    ChartSpendomatComponent,
    ChartSpendomatRowComponent,
    ChartAdamkeyComponent,
  ],
  imports: [
    CommonModule,
    MushonkeyModule,
    AdamkeyModule
  ],
  exports: [
    ChartPlotlyComponent,
    ChartMushonkeyComponent,
    ChartHorizontalBarchartComponent,
    ChartPointatronComponent,
    ChartComparatronComponent,
    ChartSpendomatComponent,
    ChartAdamkeyComponent,
  ]
})
export class ChartsModule { }
