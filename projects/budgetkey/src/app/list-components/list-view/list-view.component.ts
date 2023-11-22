import { Component, Input, OnChanges, OnInit, SimpleChanges, computed, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListContents, ListsService } from '../../common-components/services/lists.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Format } from '../../format';

@UntilDestroy()
@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.less']
})
export class ListViewComponent implements OnChanges {

  @Input() list: ListContents;

  format = new Format();
  
  items = signal<any[]>([]);

  constructor() {
    
  }

  ngOnChanges(): void {
    this.items.set(
      (this.list?.items || [])
      .map((item) => item.properties)
      .filter((item) => !!item)
    );
  }
}
