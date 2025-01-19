import {Component, Input, Output, EventEmitter} from '@angular/core';
import { FilterMenu, FilterOption } from '../../common-components/components/searchbar/bk-search-bar.component';

@Component({
    selector: 'search-filter-menu',
    templateUrl: './search-filter-menu.component.html',
    styleUrls: ['./search-filter-menu.component.less'],
    standalone: false
})
export class SearchFilterMenuComponent {
  @Input() menu: FilterMenu;
  @Output() selected = new EventEmitter();

  constructor() {}

  set selectedOption(option: FilterOption) {
    this.menu.selected = option;
    this.selected.emit(option);
  }

  get selectedOption(): FilterOption | undefined{
    return this.menu.selected;
  }
}
