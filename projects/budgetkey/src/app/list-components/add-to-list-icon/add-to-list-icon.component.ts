import { Component, Input, OnChanges, SimpleChanges, effect } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ListsService } from '../../common-components/services/lists.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  tempListId: string = '';

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
    if (list) {
      this.tempListId = list.user_id + ':' + list.name;
    } else {
      this.tempListId = '';
    }
    this.subscribed = this.item && this.item.source.doc_id && !!this.itemIds[this.item.source.doc_id];
  }

  add() {
    if (!this.subscribed) {
      this.subscribed = true;
      this.lists.addItemToList('test-list', this.item).subscribe((item) => {
        console.log('ADDED TO LIST', this.tempListId);
        this.router.navigate(['.'], { relativeTo: this.route, queryParams: { list: this.tempListId }, queryParamsHandling: 'merge' });
      });
    }
  }
  
}
