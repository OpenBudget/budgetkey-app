import { Component, Input, OnChanges } from '@angular/core';
import { Indicator } from '../../../model';
import questions from './questions';
import { Format } from '../../format';

@Component({
  selector: 'app-item-ngo-district-report',
  templateUrl: './item-ngo-district-report.component.html',
  styleUrls: ['./item-ngo-district-report.component.less']
})
export class ItemNgoDistrictReportComponent implements OnChanges {
  @Input() item: any;

  indicators: Indicator[] = [];

  questions = questions;
  format = new Format();

  ngOnChanges(): void {
    this.indicators = [
      new Indicator(
        'icon-shetach.svg',
        this.shetachTemplate()
      ),
      new Indicator(
        'icon-madad.svg',
        this.madadTemplate()
      ),
      new Indicator(
        'icon-toshavim.svg',
        this.toshavimTemplate()
      ),  
    ];
  }

  shetachTemplate() {
    return `שטח בנוי <br/><span class='figure'>${ this.format.number(this.item.details.built_area)} קמ״ר</span>`;
  }

  madadTemplate() {
    return `מדד חברתי-כלכלי משוקלל <br/><span class='figure'>${ this.format.number(this.item.details.socioeconomic) }</span>`;
  }

  toshavimTemplate() {
    return `מספר תושבים מוערך <br/><span class='figure'>${ this.format.number(this.item.details.population) }</span>`;
  }

}
