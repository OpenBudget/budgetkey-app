import { Component, Input, OnChanges } from '@angular/core';
import questions from '../questions';

@Component({
  selector: 'app-item-budget-func-detail',
  templateUrl: './item-budget-func-detail.component.html',
  styleUrls: ['./item-budget-func-detail.component.less']
})
export class ItemBudgetFuncDetailComponent implements OnChanges {
  @Input() item: any;

  parent = '';
  parentId = '';

  questions = questions;

  ngOnChanges() {
    if (this.item) {
      this.parent = this.item.func_cls_title_1[0];
      const parentClsCode = JSON.parse(this.item.func_cls_json[0])[0];
      this.parentId = `budget/C${parentClsCode}/${this.item.year}`;
    }
  }
}
