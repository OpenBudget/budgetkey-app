import { Component, Input } from '@angular/core';
import { Format } from '../../../../format';

@Component({
  selector: 'app-item-company',
  templateUrl: './item-company.component.html',
  styleUrls: ['./item-company.component.less']
})
export class ItemCompanyComponent {
  @Input() item: any;

  format = new Format();
}
