import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-muni-item-tidbit',
  templateUrl: './muni-item-tidbit.component.html',
  styleUrls: ['./muni-item-tidbit.component.less']
})
export class MuniItemTidbitComponent {
  
  @Input() item: any;
  @Input() name = false;
  @Input() kind = 'string';

  get value() {
    if (!this.item) {
      return null;
    }
    if (Array.isArray(this.item.value)) {
      return this.item.value.join(', ');
    }
    try {
      if (this.kind === 'integer') {
        return parseInt(this.item.value, 10).toLocaleString();
      }
      if (this.kind === 'percent') {
        return parseFloat(this.item.value).toFixed(1) + '%';
      }  
    } catch(e) {
      return this.item.value;
    }
    return this.item.value;
  }
}
