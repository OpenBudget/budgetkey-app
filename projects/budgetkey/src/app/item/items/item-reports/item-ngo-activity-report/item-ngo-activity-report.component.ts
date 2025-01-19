import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import questions from './questions';
import { Indicator } from '../../../model';
import { Format } from '../../../../format';

@Component({
    selector: 'app-item-ngo-activity-report',
    templateUrl: './item-ngo-activity-report.component.html',
    styleUrls: ['./item-ngo-activity-report.component.less'],
    standalone: false
})
export class ItemNgoActivityReportComponent implements OnChanges {
  @Input() item: any;

  indicators: Indicator[] = [];

  questions = questions;
  format = new Format();

  ngOnChanges(): void {
      this.indicators = [
        new Indicator(
          'icon-hadash.svg',
          this.hadashTemplate()
        ),
        new Indicator(
          'icon-ovdim.svg',
          this.ovdimTemplate()
        ),
        new Indicator(
          'icon-shnati.svg',
          this.shnatiTemplate()
        ),
        new Indicator(
          'icon-coins.svg',
          this.coinsTemplate()
        ),
      ];
  }

  hadashTemplate() {
    const total = this.item?.details?.report?.total || {};
    const is_new_org = this.item?.details?.report.is_new_org || {};
    return `${ this.format.number(total.total_amount) } ארגונים פרסמו נתונים ב-3 השנים האחרונות` +
      (is_new_org.total_amount ?
        ` מתוכם ${ is_new_org.total_amount || 0 } ארגונים חדשים הוקמו בשנים אלו` : '')
  }

  ovdimTemplate() {
    const regionList = (this.item.details.report.total.association_activity_region_list || []);
    const regions = regionList.slice(0, 3).map((x: any) => x[0]).join(', ');
    const extra = regionList.length > 4 ? ` וב-${ regionList.length - 3 } ישובים נוספים ` : (regionList.length === 4 ? `ובישוב נוסף אחד` : '');
    const report: any = this.item.details.report;

    return `${ this.format.number(report.total.association_num_of_employees) } עובדים ו-${ this.format.number(report.total.association_num_of_volunteers) } מתנדבים פעילים בארגונים אלו` +
          `ב${regions}${extra}`;
  }

  shnatiTemplate() {
    return `סה״כ המחזור הכספי השנתי המוערך לארגונים בתחום: ` +
      this.format.ils(this.item.details.report.total.yearly_turnover_total_in_field) + `, המחזור החציוני: ` +
      this.format.ils(this.item.details.report.total.yearly_turnover_median_in_field);
  }

  coinsTemplate() {
    if (this.item.details.total_received_in_field) {
      return `סך כספי הממשלה שהועברו באופן ישיר לארגונים ` + this.format.ils(this.item.details.total_received_in_field);
    } else {
      return 'ארגונים בתחום זה לא קיבלו כספי ממשלה בשלוש השנים האחרונות';
    }
  }
}
