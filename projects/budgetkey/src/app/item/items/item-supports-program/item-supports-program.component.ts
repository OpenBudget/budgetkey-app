import { Component, Input, OnChanges } from '@angular/core';
import { Format } from '../../../format';
import questions from './questions';

@Component({
    selector: 'app-item-supports-program',
    templateUrl: './item-supports-program.component.html',
    styleUrls: ['./item-supports-program.component.less'],
    standalone: false
})
export class ItemSupportsProgramComponent implements OnChanges {
  @Input() item: any;

  format = new Format();
  questions = questions;


  ngOnChanges() {
    if (!this.item) {
      return;
    }
  }
}
