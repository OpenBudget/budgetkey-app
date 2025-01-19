import { Component, Input, OnChanges } from '@angular/core';
import { Format } from '../../../format';

@Component({
    selector: 'app-item-procurement',
    templateUrl: './item-procurement.component.html',
    styleUrls: ['./item-procurement.component.less'],
    standalone: false
})
export class ItemProcurementComponent implements OnChanges {
  @Input() item: any;

  isTender = false;
  isContract = false;
  isCallForBids = false;
  isSupportCriteria = false;

  format = new Format();

  ngOnChanges() {
    this.isCallForBids = false;
    this.isSupportCriteria = false;
    this.isContract = false;
    this.isTender = false;
    if (!this.item) {
      return;
    }
    if (this.item.tender_type === 'call_for_bids') {
        this.isCallForBids = true;
    } else if (this.item.tender_type === 'support_criteria') {
        this.isSupportCriteria = true;
    } else if (!!this.item.order_id) {
        this.isContract = true;
    } else {
        this.isTender = true;
    }
    this.item.firstUpdateDate = this.firstUpdateDate(this.item);
  }

  firstUpdateDate(item: any) {
    if (item.start_date) {
      return this.format.date(item.start_date);
    }
    if (item.order_date) {
      return this.format.date(item.order_date);
    }
    if (item.payments) {
      return item.payments[0].date;
    }
    if (item.__created_at) {
      return this.format.date(item.__created_at);
    }
  }

}
