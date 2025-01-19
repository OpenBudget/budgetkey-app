import { Component, Input, OnChanges } from '@angular/core';
import { Format } from '../../../format';
import questions from './questions';

@Component({
    selector: 'app-item-supports',
    templateUrl: './item-supports.component.html',
    styleUrls: ['./item-supports.component.less'],
    standalone: false
})
export class ItemSupportsComponent implements OnChanges {
  @Input() item: any;

  format = new Format();
  questions = questions;

  purposes: any[] = [];

  ngOnChanges() {
    if (!this.item) {
      return;
    }
    this.purposes = [];
    const supportTitles: string[] = [];
    for (const payment of this.item.payments) {
      if (payment.support_title && supportTitles.indexOf(payment.support_title) === -1) {
        supportTitles.push(payment.support_title);
        this.purposes.push({
          support_title: payment.support_title,
          supporting_ministry: payment.supporting_ministry || this.item.supporting_ministry,
          budget_code: payment.budget_code || this.item.budget_code,
        });
      }   
    }
  }
}
