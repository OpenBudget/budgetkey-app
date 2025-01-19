import { Component, Input } from '@angular/core';
import { Format } from '../../../format';

@Component({
    selector: 'app-item-gov-decision',
    templateUrl: './item-gov-decision.component.html',
    styleUrls: ['./item-gov-decision.component.less'],
    standalone: false
})
export class ItemGovDecisionComponent {
  @Input() item: any;

  format = new Format();
}
