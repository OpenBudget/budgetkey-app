import { Component, Input } from '@angular/core';
import { Format } from '../format';

@Component({
  selector: 'app-item-people',
  templateUrl: './item-people.component.html',
  styleUrls: ['./item-people.component.less']
})
export class ItemPeopleComponent {
  @Input() item: any;

  format = new Format();
}
