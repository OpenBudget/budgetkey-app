import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';


@Component({
    selector: 'app-modal',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.less'],
})
export class ModalComponent {
  @Input() title: string;
  @Output() close = new EventEmitter();

  constructor() {
  }

  _close() {
    this.close.emit(null);
  }

}
