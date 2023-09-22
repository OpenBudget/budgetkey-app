import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { first, fromEvent } from 'rxjs';

@Component({
  selector: 'app-item-questions-parameter',
  templateUrl: './item-questions-parameter.component.html',
  styleUrls: ['./item-questions-parameter.component.less']
})
export class ItemQuestionsParameterComponent {
  @Input() public value: any;
  @Input() public values: any[];
  @Output() public change = new EventEmitter<any>();

  isDropDownVisible = false;

  constructor() {
  }

  toggleDropdown(event?: MouseEvent) {
    event?.stopPropagation();
    this.isDropDownVisible = !this.isDropDownVisible;
    if (this.isDropDownVisible) {
      fromEvent(window, 'click').pipe(first()).subscribe(() => {
        this.isDropDownVisible = false;
      });
    }
  }

  setValue(value: any) {
    this.value = value;
    this.isDropDownVisible = false;
    this.change.emit(this.value);
  }

}
