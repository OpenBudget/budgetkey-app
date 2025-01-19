import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'app-item-income4dig',
    templateUrl: './item-income4dig.component.html',
    styleUrls: ['./item-income4dig.component.less'],
    standalone: false
})
export class ItemIncome4digComponent implements OnChanges {
  @Input() item: any;

  parent = '';
  parentId = '';

  ngOnChanges() {
    if (this.item && this.item.hierarchy && this.item.hierarchy.length > 0) {
      const lastHierarchy = this.item.hierarchy[this.item.hierarchy.length - 1];
      this.parent = lastHierarchy[1];
      this.parentId = `budget/${lastHierarchy[0]}/${this.item.year}`;      
    }
  }
}
