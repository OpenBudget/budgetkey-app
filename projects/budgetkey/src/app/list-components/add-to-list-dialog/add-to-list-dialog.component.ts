import { AfterViewInit, Component, ElementRef, EventEmitter, Output, effect } from '@angular/core';
import { EMPTY_LIST, ListContents, ListsService } from '../../common-components/services/lists.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { first, fromEvent } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-add-to-list-dialog',
  templateUrl: './add-to-list-dialog.component.html',
  styleUrls: ['./add-to-list-dialog.component.less']
})
export class AddToListDialogComponent implements AfterViewInit {

  @Output() selectedList = new EventEmitter<{list: ListContents, itemNotes: string}>();

  list: ListContents = EMPTY_LIST;

  notes = true;
  editing = false;
  itemNotes = '';

  constructor(private el: ElementRef, private lists: ListsService) {
    effect(() => {
      const currentList = this.lists.currentList();
      if (currentList) {
        this.list = currentList;
      } else {
        const lists = (this.lists.curatedLists() || []).sort((a, b) => (b.update_time || '').localeCompare(a.update_time || ''));
        if (lists.length > 0) {
          this.list = lists[0];
        }
      }
    });
  }

  ngAfterViewInit(): void {
    const el = this.el.nativeElement as HTMLElement;
    fromEvent(el, 'click').pipe(
      untilDestroyed(this)
    ).subscribe((e) => {
      e.stopPropagation();
    });
    fromEvent(document, 'click').pipe(
      untilDestroyed(this),
      first(),
    ).subscribe(() => {
      if (this.list) {
        this.selectedList.emit({list: this.list, itemNotes: this.itemNotes});
      }
    });
  }
}
