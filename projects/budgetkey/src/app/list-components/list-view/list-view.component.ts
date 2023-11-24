import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, computed, signal } from '@angular/core';
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
  styleUrls: ['./list-view.component.less']
})
export class ListViewComponent implements OnChanges {

  @Input() list: ListContents;

  @ViewChild('titleEl') titleEl: ElementRef;
  @ViewChild('descriptionEl') descriptionEl: ElementRef;

  format = new Format();
  items = signal<any[]>([]);
  editable = signal<boolean>(false);

  constructor(private auth: AuthService, private lists: ListsService) {
    this.auth.getUser().pipe(
      untilDestroyed(this),
      map((user) => user?.profile?.id)
    ).subscribe((user) => {
      if (user) {
        this.editable.set(user === this.list?.user_id);
      } else {
        this.editable.set(false);
      }
    });
  }

  ngOnChanges(): void {
    this.items.set(
      (this.list?.items || [])
      .map((item) => item.properties)
      .filter((item) => !!item)
    );
  }

  save() {
    if (this.editable()) {
      console.log('SAVING LIST', this.list);
      this.lists.updateList(this.list.name, this.list).subscribe((list) => {
        console.log('SAVED LIST', list);
      });
    }
  }

  set title(title: string) {
    console.log('TITLE', title);
    this.list.title = title.trim();
    this.save();
    (this.titleEl.nativeElement as HTMLElement).innerHTML = this.title;
  }

  get title(): string {
    if (this.list?.title?.trim().length) {
      return this.list?.title.trim();
    } else {
      return 'רשימה ללא שם';
    }
  }

  set description(description: string) {
    console.log('DESCRIPTION', description);
    this.list.properties.description = description;
    this.save();
    (this.descriptionEl.nativeElement as HTMLElement).innerHTML = this.description;
  }

  get description(): string {
    return this.list?.properties?.description || 'רשימה ללא תיאור';
  }
}
