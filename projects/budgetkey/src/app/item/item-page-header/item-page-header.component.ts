import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-item-page-header',
  templateUrl: './item-page-header.component.html',
  styleUrls: ['./item-page-header.component.less']
})
export class ItemPageHeaderComponent {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() category: string;
  @Input() extraInfo: string;
  @Input() amount: string;

  @Input() bgColor: string;
  @Input() borderColor: string;

  @Input() primaryColor: string;
  @Input() secondaryColor: string;
}
