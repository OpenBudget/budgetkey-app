import { Component, Input } from '@angular/core';
import { Format } from '../../format';

@Component({
  selector: 'app-item-association',
  templateUrl: './item-association.component.html',
  styleUrls: ['./item-association.component.less']
})
export class ItemAssociationComponent {
  @Input() item: any;

  format = new Format();
}
