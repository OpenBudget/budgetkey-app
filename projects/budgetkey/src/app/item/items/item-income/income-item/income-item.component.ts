import { Component, Input, OnChanges } from '@angular/core';
import { Question } from '../../../model';
import { Format } from '../../../../format';
import questions from '../questions';

@Component({
  selector: 'app-income-item',
  templateUrl: './income-item.component.html',
  styleUrls: ['./income-item.component.less']
})
export class IncomeItemComponent implements OnChanges{
  @Input() item: any;
  
  questions = questions;

  public format = new Format();
  
  executedYear: number | null;
  startYear: number | null  = null;   
  takana = false;

  ngOnChanges(): void {
    this.executedYear = null;
    this.startYear = null;   
    this.takana = this.item?.code?.length === 10; 
    if (this.item?.history) {
      for (let year = this.item.year-1; year > this.item.year - 5; year--) {
        if (this.item.history[year]?.net_executed) {
          this.executedYear = year;
          break;
        }
      }
      this.startYear = parseInt(Object.keys(this.item.history).sort()[0]);
    }
  }
}