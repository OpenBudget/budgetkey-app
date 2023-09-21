import { Component, Input } from '@angular/core';
import { Format } from '../format';

@Component({
  selector: 'app-item-budget-changes',
  templateUrl: './item-budget-changes.component.html',
  styleUrls: ['./item-budget-changes.component.less']
})
export class ItemBudgetChangesComponent {
  @Input() item: any;

  questions = [];

  format = new Format();
}
