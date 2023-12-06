import { Component, Input, OnChanges, SimpleChanges, computed, effect, signal } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { EMPTY_LIST, ListContents, ListsService } from '../../common-components/services/lists.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AddToListDialogCommand } from '../add-to-list-dialog/add-to-list-dialog.component';
import { EMPTY, forkJoin, from, map, of, switchMap, tap, timer } from 'rxjs';
import { DocResultEntry } from '../../common-components/search-models';

@UntilDestroy()
@Component({
  selector: 'app-add-to-list-icon',
  templateUrl: './add-to-list-icon.component.html',
  styleUrls: ['./add-to-list-icon.component.less'],
  host: {
    '[class.enabled]': 'enabled()',
  }
})
export class AddToListIconComponent implements OnChanges {
  @Input() doc: DocResultEntry;

  enabled = computed(() => {
    return this.lists.hasCuratedLists();
  });
  subscribed = signal(false);
  tooltipText = computed(() => {
    if (this.dialogOpen()) {
      return null;
    }
    if (!this.enabled()) {
      return 'יש להתחבר בכדי<br/>להוסיף לרשימה';
    }
    if (this.subscribed()) {
      return 'ניהול פריט';
    } else {
      return 'הוספה לרשימה';
    }
  });
  itemIds: any = {};
  processing = signal(false);
  dialogOpen = signal(false);

  constructor(public lists: ListsService, private router: Router, private route: ActivatedRoute) {
    effect(() => this.update(), {
      allowSignalWrites: true,
    });
  }

  ngOnChanges(): void {
    this.update();
  }

  update() {
    this.itemIds = this.lists.curatedItemIds();
    this.subscribed.set(this.doc && this.doc.source.doc_id && !!this.itemIds[this.doc.source.doc_id]);
  }

  click() {
    if (!this.enabled()) {
      return;
    }
    if (this.processing()) {
      return;
    }
    this.dialogOpen.set(true);
    timer(50).subscribe(() => {
      this.subscribed.set(true);
    });
  }

  tooltip() {
  }

  execute(commands: AddToListDialogCommand[]) {
    this.dialogOpen.set(false);
    this.processing.set(true);
    this.update();
    if (commands.length === 0) {
      this.processing.set(false);
      return;
    }
    const observables = commands.map(command => this.executeCommand(command));
    forkJoin(observables)
      .subscribe((results) => {
        commands.forEach((command) => {
          const result = results.shift();
          let listToOpen: ListContents | null = null;
          if (command.command === 'open-list' && command.list) {
            listToOpen = command.list;
          } else if (command.command === 'new-list' && result) {
            listToOpen = result as ListContents;
          }
          if (listToOpen) {
            const key = `${listToOpen.user_id}:${listToOpen.name}`;
            this.router.navigate(['.'], { relativeTo: this.route, queryParams: { list: key }, queryParamsHandling: 'merge' });
          }
        });
        this.processing.set(false);
      });
  }

  executeCommand(command: AddToListDialogCommand) {
    if (command.command === 'add-item' && command.list && this.doc) {
      const doc = Object.assign({}, this.doc, {__notes: command.itemNotes});
      return this.lists.addDocToList(command.list.name, doc);
    } else if (command.command === 'remove-item') {
      if (command.itemId && command.list && command.itemId) {
        return this.lists.removeItemFromList(command.list.name, command.itemId);
      }
    } else if (command.command === 'new-list' && command.listTitle) {
      if (command.listTitle) {
        const properties = Object.assign({}, EMPTY_LIST, {title: command.listTitle});
        return this.lists.createList(properties).pipe(
          switchMap((list: ListContents) => {
            return this.lists.addDocToList(list.name, this.doc).pipe(
              map(() => list),
            );
          }),
        );
      }
    }
    return of(true);
  }
}
