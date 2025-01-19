import {Component, Input, Output, EventEmitter} from '@angular/core';
import { FilterMenu } from '../../common-components/components/searchbar/bk-search-bar.component';

@Component({
    selector: 'search-filter-menu-bar',
    templateUrl: './search-filter-menu-bar.component.html',
    styleUrls: ['./search-filter-menu-bar.component.less'],
    standalone: false
})
export class SearchFilterMenuBarComponent {
  @Input() menus: FilterMenu[];
  @Input() bare = false;
  @Output() selected = new EventEmitter();

  constructor() {}

  onSelected(menu: FilterMenu) {
    this.selected.emit(menu);
  }
}

