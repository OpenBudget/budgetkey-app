import { Component, OnInit, Input, OnChanges, SimpleChange, SimpleChanges, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'search-tag',
    templateUrl: './search-tag.component.html',
    styleUrls: ['./search-tag.component.less'],
    standalone: false
})
export class SearchTagComponent implements OnChanges {

  @Input() name: string;
  @Input() amount: number;
  @Input() selected = false;
  @Input() main = false;
  @Input() bare = false;

  @Output() select = new EventEmitter<void>();

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
  }

  select_() {
    this.select.emit();
  }

}
