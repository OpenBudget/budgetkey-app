import { Injectable, signal } from '@angular/core';
import { DocResultEntry } from '../common-components/search-models';
import { ListContents } from '../common-components/services/lists.service';
import { Subject, Subscription, animationFrameScheduler, interval, takeUntil, timer } from 'rxjs';

export interface AddToListDialogCommand {
  command: 'add-item' | 'remove-item' | 'open-list' | 'new-list';
  list?: ListContents;
  itemNotes?: string;
  itemId?: number;
  listTitle?: string;
};

@Injectable()
export class ListDialogService {

  dialogOpen = signal(false);
  listSelection = signal(false);
  doc: any = signal<DocResultEntry|null>(null);
  top = signal(0);
  right = signal(0);

  executeQ = new Subject<[DocResultEntry, AddToListDialogCommand[]]>();
  closeQ = new Subject<void>();
  positionSub: Subscription | null = null;

  constructor() { }

  execute(commands: AddToListDialogCommand[]) {
    this.executeQ.next([this.doc(), commands]);
  }

  open(doc: DocResultEntry, listSelection: boolean, el: HTMLElement) {
    if (this.dialogOpen()) {
      this.close();
      timer(0).subscribe(() => this.open(doc, listSelection, el));
    } else {
      this.doc.set(doc);
      this.listSelection.set(listSelection);
      this.positionSub = interval(16, animationFrameScheduler).pipe(
        takeUntil(this.closeQ),
      ).subscribe(() => {
        const rect = el.getBoundingClientRect();
        this.top.set(rect.bottom);
        this.right.set(rect.right);
      });
      this.dialogOpen.set(true);
    }
  }

  close() {
    console.log('closed');
    this.positionSub?.unsubscribe();
    this.positionSub = null;
    this.closeQ.next();
  }
}
