import { Component, Input } from '@angular/core';
import { Format } from '../../format';
import { tooltip } from '../tooltips';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-item-support-criteria',
  templateUrl: './item-support-criteria.component.html',
  styleUrls: ['./item-support-criteria.component.less']
})
export class ItemSupportCriteriaComponent {

  @Input() item: any;

  format = new Format();
  tooltip = tooltip;

  description_expanded = false;

  publisher() {
    return this.item['publisher'];
  }

  tenderType() {
    return this.item['reason'] || 'מבחני תמיכה';
  }

  start_date() {
    return this.item['start_date'] ? dayjs(this.item['start_date']).format('DD/MM/YYYY') : 'לא ידוע';
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

  description() {
    if (this.item['description']) {
      return this.item['description'];
    }
    return 'פרסום זה כולל במקור המידע את הקבצים המצורפים, ללא מידע נוסף.';
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
    rets.push([
      'עוד על קבלת תמיכות ממשרדי הממשלה',
      'http://haogdan.migzar3.org.il/%D7%AA%D7%9E%D7%99%D7%9B%D7%94_%D7%9E%D7%9E%D7%A9%D7%A8%D7%93_%D7%9E%D7%9E%D7%A9%D7%9C%D7%AA%D7%99',
      'באתר האוגדן',
    ]);
    return rets;
  }

  processTag() {
    return this.item['tender_type_he'] || 'מבחן תמיכה';
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

  actionables() {
    const a: any[] = this.actionables_aux();
    if (a && this.closingSoon()) {
      return a.slice(1);
    }
    return a;
  }
}
