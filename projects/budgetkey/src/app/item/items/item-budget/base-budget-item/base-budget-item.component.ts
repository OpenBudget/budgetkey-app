import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Question } from '../../../model';
import { Format } from '../../../../format';

@Component({
  selector: 'app-base-budget-item',
  templateUrl: './base-budget-item.component.html',
  styleUrls: ['./base-budget-item.component.less']
})
export class BudgetItemComponent implements OnChanges {
  @Input() item: any;
  @Input() questions: Question[];

  public format = new Format();
  
  executedYear: number | null;
  startYear: number | null;
  takana = false;
  title = '';
  subtitle = '';

  ngOnChanges(): void {
    this.executedYear = null;
    this.startYear = null;   
    this.takana = this.item?.code?.length === 10; 
    if (this.item?.history) {
      for (let year = this.item.year-1; year > this.item.year - 5; year--) {
        if (this.item.history[year] && this.item.history[year].net_executed) {
          this.executedYear = year;
          break;
        }
      }
      this.startYear = parseInt(Object.keys(this.item.history).sort()[0]);
    }
    if (this.item) {
      this.title = this.item.code === '00' ? 'תקציב המדינה' : this.item.title;
      this.subtitle = this.item.code[0] === 'C' ? '' : (this.item.code === '00' ? `${this.item.year}` : this.item['nice-code']);
    }
  }
}
