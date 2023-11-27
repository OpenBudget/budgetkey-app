import { Component, Input, OnChanges, SimpleChanges, effect } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ListContents, ListsService } from '../../common-components/services/lists.service';
import { ActivatedRoute, Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-add-to-list-icon',
  templateUrl: './add-to-list-icon.component.html',
  styleUrls: ['./add-to-list-icon.component.less'],
  host: {
    '[class.enabled]': 'enabled',
  }
})
export class AddToListIconComponent implements OnChanges {
  @Input() item: any;

  enabled = false;
  subscribed = false;
  itemIds: any = {};
  itemId: number = -1;
  processing: boolean = false;
  adding: boolean = false;
  currentListName = '';

  constructor(public lists: ListsService, private router: Router, private route: ActivatedRoute) {
    effect(() => this.update());
  }

  ngOnChanges(): void {
    this.update();
  }

  update() {
    this.enabled = this.lists.hasCuratedLists();
    this.itemIds = this.lists.currentListItemIds();
    const list = this.lists.currentList();
    this.currentListName = list ? list.name : '';
    this.subscribed = this.item && this.item.source.doc_id && !!this.itemIds[this.item.source.doc_id];
    this.itemId = (this.item && this.itemIds[this.item.source.doc_id]) || -1;
  }

  click() {
    if (this.processing) {
      return;
    }
    if (this.subscribed) {
      this.remove();
    } else {
      this.adding = true;
    }
  }

  add(params: {list: ListContents, itemNotes: string}) {
    this.processing = true;
    this.adding = false;
    const item = Object.assign({}, this.item, {__notes: params.itemNotes});
    this.lists.addDocToList(params.list.name, item).subscribe((item) => {
      const listId = params.list.user_id + ':' + params.list.name;
      console.log('ADDED TO LIST', listId);
      this.router.navigate(['.'], { relativeTo: this.route, queryParams: { list: listId }, queryParamsHandling: 'merge' });
      this.subscribed = true;
      this.processing = false;
    });
  }
  
  remove() {
    this.processing = true;
    this.lists.removeItemFromList(this.currentListName, this.itemId).subscribe((item) => {
      console.log('REMOVED FROM LIST', this.currentListName);
      this.subscribed = false;
      this.processing = false;
    });
  }
}
