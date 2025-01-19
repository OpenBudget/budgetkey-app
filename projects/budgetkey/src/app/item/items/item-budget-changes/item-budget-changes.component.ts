import { Component, Input } from '@angular/core';
import { Format } from '../../../format';

@Component({
    selector: 'app-item-budget-changes',
    templateUrl: './item-budget-changes.component.html',
    styleUrls: ['./item-budget-changes.component.less'],
    standalone: false
})
export class ItemBudgetChangesComponent {
  @Input() item: any;

  questions = [];

  format = new Format();

  partyFrom = '';
  partyTo = '';

  ngOnChanges() {
    if (this.item) {
      this.partyFrom = this.item?.summary?.from.map((i: any[]) => i[2]).join(', ');
      this.partyTo = this.item?.summary?.to.map((i: any[]) => i[2]).join(', ');
    }
  }
}
