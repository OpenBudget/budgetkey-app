import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdamkeyModule } from 'adamkey';
import { MushonkeyModule } from 'mushonkey';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { ChartAdamkeyComponent } from './chart-adamkey/chart-adamkey.component';
import { ChartComparatronComponent } from './chart-comparatron/chart-comparatron.component';
import { ChartHorizontalBarchartComponent } from './chart-horizontal-barchart/chart-horizontal-barchart.component';
import { ChartMushonkeyComponent } from './chart-mushonkey/chart-mushonkey.component';
import { ChartPointatronComponent } from './chart-pointatron/chart-pointatron.component';
import { ChartSpendomatRowComponent } from './chart-spendomat/chart-spendomat-row/chart-spendomat-row.component';
import { ChartSpendomatComponent } from './chart-spendomat/chart-spendomat.component';
import { PlotlyService } from './chart-plotly/plotly.service';
import { ChartPlotlyComponent } from './chart-plotly/chart-plotly.component';



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
    CommonComponentsModule,
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
  ],
  providers: [
    PlotlyService
  ]
})
export class ChartsModule { }
