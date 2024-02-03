import { Component, Input, OnChanges } from '@angular/core';
import questions_spending8 from '../questions_spending8';
import questions from '../questions';

@Component({
  selector: 'app-item-budget8dig',
  templateUrl: './item-budget8dig.component.html',
  styleUrls: ['./item-budget8dig.component.less']
})
export class ItemBudget8digComponent implements OnChanges {
  @Input() item: any;

  parent = '';
  parentId = '';
  grandParent = '';
  grandParentId = '';
  grandGrandParent = '';
  grandGrandParentId = '';
  category = '';

  questions = [
    ...questions_spending8,
    ...questions,
  ]

  ngOnChanges() {
    if (this.item?.hierarchy) {
      const lastHierarchy = this.item.hierarchy[this.item.hierarchy.length - 1];
      this.parent = lastHierarchy[1];
      this.parentId = `budget/${lastHierarchy[0]}/${this.item.year}`;
      if (this.item.hierarchy.length > 1) {
        const grandLastHierarchy = this.item.hierarchy[this.item.hierarchy.length - 2];
        this.grandParent = grandLastHierarchy[1];
        this.grandParentId = `budget/${grandLastHierarchy[0]}/${this.item.year}`;
        if (this.item.hierarchy.length > 2) {
          const grandGrandLastHierarchy = this.item.hierarchy[this.item.hierarchy.length - 3];
          this.grandGrandParent = grandGrandLastHierarchy[1];
          this.grandGrandParentId = `budget/${grandGrandLastHierarchy[0]}/${this.item.year}`;
        }
      }
    }
    if (this.item) {
      this.category = JSON.parse(this.item.func_cls_json[0])[0] + JSON.parse(this.item.func_cls_json[0])[2];
    }
  }
}