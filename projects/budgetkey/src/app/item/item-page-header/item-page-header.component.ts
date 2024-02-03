import { Component, Input, OnChanges } from '@angular/core';
import { DocResultEntry } from '../../common-components/search-models';

@Component({
  selector: 'app-item-page-header',
  templateUrl: './item-page-header.component.html',
  styleUrls: ['./item-page-header.component.less']
})
export class ItemPageHeaderComponent implements OnChanges {
  @Input() item: any;

  @Input() title: string;
  @Input() subtitle: string;
  @Input() category: string;
  @Input() extraInfo: string;
  @Input() amount: string;

  @Input() bgColor: string;
  @Input() borderColor: string;

  @Input() primaryColor: string;
  @Input() secondaryColor: string;

  doc: DocResultEntry;

  ngOnChanges(): void {
    if (this.item && this.item.doc_id) {
      this.doc = {
        highlight: null,
        source: Object.assign({}, this.item, {charts: null}),
        type: this.item.doc_id.split('/')[0],
        score: 10, 
      };
    }
  }
}
