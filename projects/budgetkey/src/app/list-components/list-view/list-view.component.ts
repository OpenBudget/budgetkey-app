import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, computed, signal } from '@angular/core';
import { ListContents, ListsService } from '../../common-components/services/lists.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Format } from '../../format';
import { AuthService } from '../../common-components/auth/auth.service';
import { map } from 'rxjs';
import { sign } from 'crypto';

@UntilDestroy()
@Component({
    selector: 'app-list-view',
    templateUrl: './list-view.component.html',
    styleUrls: ['./list-view.component.less'],
    standalone: false
})
export class ListViewComponent implements OnChanges {

  @Input() list: ListContents;
  @Input() headerControls = false;

  @Output() deleted = new EventEmitter<void>();

  @ViewChild('titleEl') titleEl: ElementRef;
  @ViewChild('descriptionEl') descriptionEl: ElementRef;

  format = new Format();
  editable = signal<boolean>(false);
  userId = '';
  shareDialog = signal<boolean>(false);
  copied = false;
  deleteDialog = signal<boolean>(false);
  link = '';

  constructor(private auth: AuthService, private lists: ListsService) {
    this.auth.getUser().pipe(
      untilDestroyed(this),
      map((user) => user?.profile?.id || '')
    ).subscribe((userId) => {
      this.userId = userId;
      this.checkEditable();
    });
  }

  ngOnChanges(): void {
    this.checkEditable();
    this.link = `${window.location.origin}/l/${this.list.user_id}/${this.list.name}`;
  }

  checkEditable() {
    if (this.userId.length) {
      this.editable.set(this.userId === this.list?.user_id);
    } else {
      this.editable.set(false);
    }
  }

  save() {
    if (this.editable()) {
      this.lists.updateList(this.list.name, this.list).subscribe((list) => {
        // console.log('List updated', list);
      });
    }
  }

  set title(title: string) {
    this.list.title = title.trim();
    this.save();
    (this.titleEl.nativeElement as HTMLElement).innerHTML = this.title;
  }

  get title(): string {
    if (this.list?.title?.trim().length) {
      return this.list?.title.trim();
    } else {
      return this.lists.emptyList.title || '';
    }
  }

  set description(description: string) {
    this.list.properties.description = description;
    this.save();
    (this.descriptionEl.nativeElement as HTMLElement).innerHTML = this.description;
  }

  get description(): string {
    return this.list?.properties?.description || 'רשימה ללא תיאור';
  }

  updateNotes(item: any, notes: string) {
    item.properties.__notes = notes;
    this.lists.addDocToList(this.list.name, item.properties).subscribe((item) => {});
  }

  share() {
    this.shareDialog.set(true);
  }

  copyLinkToClipboard() {
    const el = document.createElement('textarea');
    el.value = this.link;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.copied = true;
  }

  deleteSelf() {
    this.lists.delete(this.list.name, null).subscribe((success) => {
      this.deleted.emit();
      this.deleteDialog.set(false);
    });
  }

  get public() {
    return (this.list?.visibility || 0) > 1;
  }

  set public(value: boolean) {
    this.list.visibility = value ? 2 : 1;
    this.save();
  }
}
