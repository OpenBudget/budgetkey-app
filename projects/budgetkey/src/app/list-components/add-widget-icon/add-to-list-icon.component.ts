import { Component, Input, OnChanges, SimpleChanges, effect } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ListsService } from '../../common-components/services/lists.service';

@UntilDestroy()
@Component({
  selector: 'app-add-to-list-icon',
  templateUrl: './add-to-list-icon.component.html',
  styleUrls: ['./add-to-list-icon.component.less']
})
export class AddToListIconComponent implements OnChanges {
  @Input() item: any;

  enabled = false;
  subscribed = false;
  itemIds: any = {};

  constructor(public lists: ListsService) {
    effect(() => this.update());
  }

  ngOnChanges(): void {
    this.update();
  }

  update() {
    this.enabled = this.lists.hasCuratedLists();
    this.itemIds = this.lists.curatedItemIds();
    this.subscribed = this.item && this.item.source.doc_id && !!this.itemIds[this.item.source.doc_id];
  }

  add() {
    this.lists.testAdd(this.item);
  }
  
}
