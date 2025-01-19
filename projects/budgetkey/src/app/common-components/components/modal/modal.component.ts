import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';


@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.less'],
    standalone: false
})
export class ModalComponent {
  @Input() title: string;
  @Input() standardLayout = true;
  @Output() close = new EventEmitter();

  constructor() {
  }

  _close() {
    this.close.emit(null);
  }

}
