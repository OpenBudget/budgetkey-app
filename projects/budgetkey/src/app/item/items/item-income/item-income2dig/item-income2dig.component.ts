import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-item-income2dig',
  templateUrl: './item-income2dig.component.html',
  styleUrls: ['./item-income2dig.component.less']
})
export class ItemIncome2digComponent {
  @Input() item: any;
}
