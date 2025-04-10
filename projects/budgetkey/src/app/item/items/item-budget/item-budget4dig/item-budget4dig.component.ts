import { Component, Input, OnChanges } from '@angular/core';
import questions from '../questions';
import questions_parents from '../questions_parents';
import questions_spending from '../questions_spending';

@Component({
    selector: 'app-item-budget4dig',
    templateUrl: './item-budget4dig.component.html',
    styleUrls: ['./item-budget4dig.component.less'],
    standalone: false
})
export class ItemBudget4digComponent implements OnChanges {
  @Input() item: any;

  parent = '';
  parentId = '';
  category = '';

  questions = [
    ...questions_spending,
    ...questions,
    ...questions_parents
  ]

  ngOnChanges() {
    if (this.item?.hierarchy) {
      const lastHierarchy = this.item.hierarchy[this.item.hierarchy.length - 1];
      this.parent = lastHierarchy[1];
      this.parentId = `budget/${lastHierarchy[0]}/${this.item.year}`;
    }
    if (this.item) {
      this.category = JSON.parse(this.item.func_cls_json[0])[0] + JSON.parse(this.item.func_cls_json[0])[2];
    }
  }
}
