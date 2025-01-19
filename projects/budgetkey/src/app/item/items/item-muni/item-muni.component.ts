import { AfterViewInit, Component, ElementRef, Input, OnChanges } from '@angular/core';
import { Format } from '../../../format';
import { timer } from 'rxjs';
import { GlobalSettingsService } from '../../../common-components/global-settings.service';
import { ItemApiService } from '../../item-api.service';
import questions from '../base-org-item/questions';

@Component({
    selector: 'app-item-muni',
    templateUrl: './item-muni.component.html',
    styleUrls: ['./item-muni.component.less'],
    standalone: false
})
export class ItemMuniComponent implements OnChanges, AfterViewInit {

  @Input() item: any;

  props: any;

  format = new Format();

  budgets: any[] = [];
  incomeChartData: any = {};
  incomeChartLayout: any = {};
  incomeChartConfig: any = {displayModeBar: false};
  incomeBudgets: any[] = []
  expenseBudgets: any[] = []
  totalIncome = 0;
  totalExpense = 0;

  constructor(private globalSettings: GlobalSettingsService, private el: ElementRef, private itemApi: ItemApiService) {}

  ngOnChanges() {
    this.budgets = ((this.item.details && this.item.details.select_budgets) || ([] as any[])).sort((a: any, b: any) => b.value - a.value);
    this.incomeBudgets = [];
    this.expenseBudgets = [];
    this.totalIncome = 0;
    this.totalExpense = 0;
    this.budgets.forEach((b) => {
      if (!b.use) {
        if (b.code.length === 1 && b.code[0] < '6') {
          b.use = 'income-pie';
        } else if (b.code.length === 2) {
          b.use = 'selected';
        }
      }
      if (b.code.length === 1) {
        b.num_value = Math.abs(b.executed || b.revised || b.allocated || 0);
        if (b.code[0] < '6') {
          this.incomeBudgets.push(b);
          this.totalIncome += Math.abs(parseFloat(b.value));
        } else {
          this.expenseBudgets.push(b);
          this.totalExpense += Math.abs(parseFloat(b.value));
        }
      }
    });
    this.budgets.forEach((b) => {
      if (b.code.length === 1) {
        b.muni_code = this.ext.symbol.value;
        if (b.code[0] < '6') {
          b.pct = (b.num_value / this.totalIncome) * 100 + '%';
        } else {
          b.pct = (b.num_value / this.totalExpense) * 100 + '%';
        }
        b.s_value = this.format.ils(b.num_value);
      }
    });
    this.incomeBudgets = this.incomeBudgets.sort((a, b) => a.code.localeCompare(b.code));
    this.expenseBudgets = this.expenseBudgets.sort((a, b) => a.code.localeCompare(b.code));
    this.incomeChartData = [{
      type: 'pie',
      labels: this.budgets.filter(b => b.use === 'income-pie').map(b => b.name),
      values: this.budgets.filter(b => b.use === 'income-pie').map(b => Math.abs(b.num_value)),
      hole: .4,
    }];
    this.incomeChartLayout = {
      height: 300,
      width: 0,
      margin: {b:0, l:0, r:0, t:0},
      legend: {bgcolor: 'rgba(255,255,255,0)'},
      paper_bgcolor: '#F3F3F3',
      plot_bgcolor: 'rgba(255,255,255,0)',
      colorway : ['#022E57', '#03548F', '#08A6A7', '#0CB0A7', '#0DC0DE']
    };
    this.itemApi.setQuestions(questions);
  }

  ngAfterViewInit() {
    timer(0).subscribe(() => {
      this.incomeChartLayout.width = this.el.nativeElement.offsetWidth;
      if (this.incomeChartLayout.width > 400) {
        this.incomeChartLayout.width = 400;
      }
    });
  }

  public get ext(): any {
    return (this.item.details && this.item.details.extended) || ({} as any);
  }

  budgetHref(budget: any) {
    return `/i/muni_budgets/${this.ext.symbol.value}/${budget.code}?theme=${this.globalSettings.themeId}`;
  }
}
