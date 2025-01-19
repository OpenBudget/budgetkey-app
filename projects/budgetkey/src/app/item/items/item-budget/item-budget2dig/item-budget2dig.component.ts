import { Component, Input, OnChanges } from '@angular/core';
import questions from '../questions';
import questions_parents from '../questions_parents';
import questions_spending from '../questions_spending';

@Component({
    selector: 'app-item-budget2dig',
    templateUrl: './item-budget2dig.component.html',
    styleUrls: ['./item-budget2dig.component.less'],
    standalone: false
})
export class ItemBudget2digComponent implements OnChanges {
  @Input() item: any;

  category = '';

  questions = [
    ...questions_spending,
    ...questions,
    ...questions_parents
  ];

  ngOnChanges() {
    if (this.item) {
      this.category = JSON.parse(this.item.func_cls_json[0])[0] + JSON.parse(this.item.func_cls_json[0])[2];
    }
  }
}
