import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Question } from '../../../model';
import { Format } from '../../../../format';

@Component({
  selector: 'app-base-budget-item',
  templateUrl: './base-budget-item.component.html',
  styleUrls: ['./base-budget-item.component.less']
})
export class BudgetItemComponent implements OnChanges{
  @Input() item: any;
  @Input() questions: Question[];

  public format = new Format();
  
  executedYear: number | null;
  startYear: number | null;
  takana = false;

  ngOnChanges(): void {
    this.executedYear = null;
    this.startYear = null;   
    this.takana = this.item?.code?.length === 10; 
    if (this.item?.history) {
      for (let year = this.item.year-1; year > this.item.year - 5; year--) {
        if (this.item.history[year].net_executed) {
          this.executedYear = year;
          break;
        }
      }
      this.startYear = parseInt(Object.keys(this.item.history).sort()[0]);
    }
  }
}
