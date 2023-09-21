import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-item-income8dig',
  templateUrl: './item-income8dig.component.html',
  styleUrls: ['./item-income8dig.component.less']
})
export class ItemIncome8digComponent implements OnChanges {
  @Input() item: any;

  parent = '';
  parentId = '';
  grandParent = '';
  grandParentId = '';
  grandGrandParent = '';
  grandGrandParentId = '';

  ngOnChanges() {
    if (this.item) {
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
  }
}
