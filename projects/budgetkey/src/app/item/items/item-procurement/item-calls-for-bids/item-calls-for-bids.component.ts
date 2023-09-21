import { Component, Input } from '@angular/core';
import { Format } from '../../format';
import * as dayjs from 'dayjs';
import { tooltip } from '../tooltips';

@Component({
  selector: 'app-item-calls-for-bids',
  templateUrl: './item-calls-for-bids.component.html',
  styleUrls: ['./item-calls-for-bids.component.less']
})
export class ItemCallsForBidsComponent {
  @Input() item: any;

  description_expanded = false;

  format = new Format();
  tooltip = tooltip;

  publisher() {
    return this.item['publisher'];
  }

  tenderType() {
    return this.item['reason'] || 'קול קורא';
  }

  start_date() {
    return this.item['start_date'] ? dayjs(this.item['start_date']).format('DD/MM/YYYY') : 'לא ידוע';
  }

  claim_date() {
    return this.item['claim_date'] ? dayjs(this.item['claim_date']).format('DD/MM/YYYY hh:mm') : 'לא ידוע';
  }

  alertText() {
    const lastWeek = dayjs().subtract(7, 'days');
    if (this.item['start_date'] &&
      dayjs(this.item['start_date']).isAfter(lastWeek)) {
      return 'חדש!';
    } else {
      const lastUpdateDate = this.lastUpdateDate();
      if (lastUpdateDate &&
        dayjs(lastUpdateDate).isAfter(lastWeek)) {
        return 'מעודכן!';
      }
    }
    return '';
  }

  lastUpdateDate() {
    if (this.item['__last_modified_at']) {
      return this.format.date(this.item['__last_modified_at']);
    }
    return null;
  }

  itemTitle() {
    return this.item['page_title'];
  }

  actionables_aux() {
    const rets = (this.item['actionable_tips'] || []).slice();
    if (this.item['contact']) {
      const ret = [];
      ret.push('<b>איך פונים?</b><br/>' + this.item['contact']);
      if (this.item['contact_email']) {
        ret.push('mailto:' + this.item['contact_email']);
        ret.push('לפניה באימייל');
      }
      rets.push(ret);
    }
    return rets;
  }

  actionables() {
    const a: any[] = this.actionables_aux();
    if (a && this.closingSoon()) {
      return a.slice(1);
    }
    return a;
  }

  processTag() {
    return this.item['tender_type_he'] || 'קול קורא';
  }

  open_document(attachment: any) {
    window.open(attachment.link, '_blank');
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

}
