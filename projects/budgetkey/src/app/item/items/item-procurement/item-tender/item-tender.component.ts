import { Component, Input, OnChanges } from '@angular/core';
import { Format } from '../../../../format';
import { tooltip } from '../tooltips';
import { GlobalSettingsService } from '../../../../common-components/global-settings.service';
import { ItemApiService } from '../../../item-api.service';
import questionsTenders from './questions-tenders';
import questionsMunicipal from './questions-municipal';

const dayjs = Format.dayjs;

@Component({
  selector: 'app-item-tender',
  templateUrl: './item-tender.component.html',
  styleUrls: ['./item-tender.component.less']
})
export class ItemTenderComponent implements OnChanges {

  @Input() item: any;

  format = new Format();
  tooltip = tooltip;

  awardees_expanded = false;

  constructor(private globalSettings: GlobalSettingsService, private api: ItemApiService) { }

  ngOnChanges(): void {
    let questions = questionsTenders;
    if (this.item.doc_id?.indexOf('municipal') === 0) {
      questions = questionsMunicipal;
    }
    if (questions) {
      this.api.setQuestions(questions);
    }
  }

  publisher() {
    return this.item['publisher'];
  }

  tenderType() {
    return ({
      office: 'מכרז משרדי',
      central: 'מכרז מרכזי',
      exemption: 'בקשת פטור ממכרז',
    } as any)[this.item['tender_type']];
  }

  alertText() {
    const lastWeek = dayjs().subtract(7, 'days');
    if (this.item['start_date'] &&
      dayjs(this.item['start_date']).isAfter(lastWeek)) {
      return 'חדש!';
    }
    if (this.item['last_update_date'] &&
      dayjs(this.item['last_update_date']).isAfter(lastWeek)) {
      return 'עודכן!';
    }
    return '';
  }

  lastUpdateDate() {
    if (this.item['last_update_date']) {
      return this.format.relativeDate(this.item['last_update_date']);
    }
    if (this.item['__last_modified_at']) {
      return this.format.relativeDate(this.item['__last_modified_at']);
    }
    return null;
  }

  lastUpdateDateTooltip() {
    return this.item['last_update_date'] || this.item['__last_modified_at'] || null;
  }

  itemTitle() {
    if (this.item['tender_kind'] === 'central') {
      return this.item['page_title'];
    }
    return this.item['description'];
  }

  totalAmount() {
    return this.item['contract_volume'] || this.item['volume'];
  }

  totalPaid() {
    return this.item['contract_executed'];
  }

  actionables_aux() {
    return this.item['actionable_tips'];
  }

  sliced_awardees() {
    const awardees = this.item['awardees'];
    if (awardees && awardees.length > 3 && !this.awardees_expanded) {
      return awardees.slice(0, 3);
    }
    return awardees;
  }

  open_document(attachment: any) {
    window.open(attachment.link, '_blank');
  }

  actionables() {
    const a: any[] = this.actionables_aux();
    if (a && this.closingSoon()) {
      return a.slice(1);
    }
    return a;
  }

  closingSoon() {
    return this.item['claim_date'] && dayjs().diff(dayjs(this.item['claim_date'])) < 0;
  }

  closingSoonTitle() {
    const days = -dayjs().diff(dayjs(this.item['claim_date']), 'days');
    let ret = '';
    if (days === 1) {
      ret = 'נותר עוד יום אחד';
    } else {
      ret = 'נותרו עוד ' + days + ' ימים';
    }
    ret = `<strong>${ret} להגשה!</strong>&nbsp;`;
    return ret;
  }

  closingSoonAction() {
    const a: any[] = this.actionables_aux();
    if (a && a[0]) {
      return a[0];
    } else {
      return [];
    }
  }

  entityLink(awardee: any) {
    const ret = '/i/org/' + awardee.entity_kind + '/' + awardee.entity_id;
    return ret + '?theme=' + this.globalSettings.themeId ;
  }

}
