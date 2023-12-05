import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, effect, signal } from '@angular/core';
import { EMPTY_LIST, ListContents, ListItem, ListsService } from '../../common-components/services/lists.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { first, fromEvent, take, timer } from 'rxjs';
import { DocResultEntry } from '../../common-components/search-models';
import { sign } from 'crypto';

export interface AddToListDialogCommand {
  command: 'add-item' | 'remove-item' | 'open-list' | 'new-list';
  list?: ListContents;
  itemNotes?: string;
  itemId?: number;
  listTitle?: string;
};

@UntilDestroy()
@Component({
  selector: 'app-add-to-list-dialog',
  templateUrl: './add-to-list-dialog.component.html',
  styleUrls: ['./add-to-list-dialog.component.less']
})
export class AddToListDialogComponent implements AfterViewInit, OnChanges {

  @Input() listSelection = false;
  @Input() doc: DocResultEntry;
  @Output() commands = new EventEmitter<AddToListDialogCommand[]>();

  ready = signal<boolean>(false);

  list: ListContents = EMPTY_LIST;
  originalSubscriptionState: any = {};
  subscriptionState: any = {};

  editing = false;
  itemNotes = '';
  newList: string | null = null;

  constructor(private el: ElementRef, public lists: ListsService) {
    effect(() => {
      if (!this.ready()) {
        return;
      }
      const currentList = this.lists.currentList();
      if (currentList) {
        this.list = currentList;
      } else {
        const lists = (this.lists.curatedLists() || []).sort((a, b) => (b.update_time || '').localeCompare(a.update_time || ''));
        if (lists.length > 0) {
          this.list = lists[0];
        }
      }
      this.lists.curatedLists()?.forEach((list) => {
        this.originalSubscriptionState[list.name] = this.checkSubscribed(list);
        this.subscriptionState[list.name] = this.originalSubscriptionState[list.name];
      });
      if (this.list && !this.listSelection) {
        this.originalSubscriptionState[this.list.name] = false;
        this.subscriptionState[this.list.name] = true;
      }
    });
  }

  ngOnChanges(): void {
    this.ready.set(true);
  }

  ngAfterViewInit(): void {
    const el = this.el.nativeElement as HTMLElement;
    let clicked = false;
    fromEvent(el, 'click').pipe(
      untilDestroyed(this)
    ).subscribe((e) => {
      clicked = true;
      e.stopPropagation();
    });
    fromEvent(el, 'mousedown').pipe(
      untilDestroyed(this)
    ).subscribe((e) => {
      clicked = true;
      e.stopPropagation();
    });
    fromEvent(el, 'touchstart').pipe(
      untilDestroyed(this)
    ).subscribe((e) => {
      clicked = true;
      e.stopPropagation();
    });
    timer(3000).pipe(
      untilDestroyed(this)
    ).subscribe(() => {
      if (!clicked) {
        this.done();
      }
    });
    fromEvent(document, 'click').pipe(
      untilDestroyed(this),
      take(1),
    ).subscribe(() => {
      this.done();
    });
  }

  done() {
    const commands: AddToListDialogCommand[] = [];
    let toOpenList: ListContents | null = null;
    for (const list of this.lists.curatedLists()) {
      if (this.originalSubscriptionState[list.name] && !this.subscriptionState[list.name]) {
        const itemId = (list.items || []).find((item: ListItem) => item.properties.source.doc_id === this.doc.source.doc_id)?.id;
        commands.push({command: 'remove-item', list, itemId});
      }
      if (!this.originalSubscriptionState[list.name] && this.subscriptionState[list.name]) {
        commands.push({command: 'add-item', list});
        toOpenList = toOpenList || list;
      }
    }
    toOpenList = toOpenList || this.list;
    if (this.newList) {
      commands.push({command: 'new-list', listTitle: this.newList});
      toOpenList = null;
    }
    if (toOpenList) {
      commands.push({'command': 'open-list', 'list': toOpenList});
    }
    this.commands.emit(commands);
  }

  checkSubscribed(list: ListContents) {
    return (list.items || []).map((item: ListItem) => item.properties.source.doc_id).indexOf(this.doc.source.doc_id) >= 0;
  }

  subscribed(list: ListContents) {
    return this.subscriptionState[list.name];
  }

  toggleSubscription(list: ListContents) {
    this.subscriptionState[list.name] = !this.subscriptionState[list.name];
  }
}
