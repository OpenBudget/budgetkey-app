import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-item-income6dig',
  templateUrl: './item-income6dig.component.html',
  styleUrls: ['./item-income6dig.component.less']
})
export class ItemIncome6digComponent implements OnChanges {
  @Input() item: any;

  parent = '';
  parentId = '';
  grandParent = '';
  grandParentId = '';

  ngOnChanges() {
    if (this.item && this.item.hierarchy && this.item.hierarchy.length > 0) {
      const lastHierarchy = this.item.hierarchy[this.item.hierarchy.length - 1];
      this.parent = lastHierarchy[1];
      this.parentId = `budget/${lastHierarchy[0]}/${this.item.year}`;
      if (this.item.hierarchy.length > 1) {
        const grandLastHierarchy = this.item.hierarchy[this.item.hierarchy.length - 2];
        this.grandParent = grandLastHierarchy[1];
        this.grandParentId = `budget/${grandLastHierarchy[0]}/${this.item.year}`;
      }
    }
  }
}
