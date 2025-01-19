import { Component, EventEmitter, Output } from '@angular/core';
import { SEARCHES_LIST } from '../../common-components/constants';
import { ListsService } from '../../common-components/services/lists.service';

@Component({
    selector: 'app-delete-all-subscription-items',
    templateUrl: './delete-all-subscription-items.component.html',
    styleUrls: ['./delete-all-subscription-items.component.less'],
    standalone: false
})
export class DeleteAllSubscriptionItemsComponent {

  @Output() changed = new EventEmitter<any>();

  constructor(private lists: ListsService) {}

  delete() {
    this.lists.delete(SEARCHES_LIST, null)
              .subscribe((_) => {
                this.changed.emit(null);
              });
  }
}
