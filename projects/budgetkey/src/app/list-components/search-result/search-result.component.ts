import { Component, Input, Inject, OnInit, EventEmitter, Output } from '@angular/core';


import { DocResultEntry } from '../../common-components/search-models';

import { GlobalSettingsService } from '../../common-components/global-settings.service';

import * as dayjs from 'dayjs';
import 'dayjs/locale/he';
import { DomSanitizer } from '@angular/platform-browser';
import { PlatformService } from '../../common-components/platform.service';
dayjs.locale('he');

type StringOrFunc = string | ((x: any) => string);

interface Parameter {
  // Colors:
  primaryColor: StringOrFunc;
  // secondaryColor: StringOrFunc;
  bgColor: StringOrFunc;
  bodyBgColor: StringOrFunc;
  bodyBorderColor: StringOrFunc;

  // Top line:
  topRight: StringOrFunc;
  topLeft?: StringOrFunc;
  topLeftIcon?: StringOrFunc;
  bottomRight: StringOrFunc;
  bottomLeft?: StringOrFunc;

  // Main body:
  bodyStyle: ('color-top' | 'color-bottom' | 'borders-solid' | 'borders-dashing' | 'icon-person' | 'icon-gov')[];
  title?: StringOrFunc[];
  subtitle?: StringOrFunc;
}


@Component({
  selector: 'search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.less'],
  host: {
    '[class.horizontal]': 'horizontal',
  }
})
export class SearchResultComponent implements OnInit {

  @Input() item: DocResultEntry;
  @Input() index: number;
  @Input() kind: string;
  @Input() horizontal = false;
  @Input() bare = false;
  @Input() listable = true;
  
  @Input() showNotes = false;
  @Input() editableNotes = false;
  @Input() notes: string;
  @Output() updatedNotes = new EventEmitter<string>();

  private PARAMETERS: { [s: string]: Parameter; } = {
    '': <Parameter>{
      primaryColor: '##444',
      // secondaryColor: '#e4dcf5',
      // tertiaryColor: '#b4a0de',
      bgColor: '#ffffff',
      // tagColor: '#7a6b99',

      topRight: '',

      title: [':page_title'],

      bottomRight: '',

      bodyStyle: ['borders-solid'],
      bodyBorderColor: '#ccc',
      bodyBgColor: '#fafafa',
    },
    // // ENTITIES
    // Companies
      'org/company': <Parameter>{
        primaryColor: '#3C4B7C',
        bgColor: '#ffffff',
  
        topRight: (x) => {
          return `<strong>${x.kind_he}</strong>`;
        },
        topLeft: (x) => {
          return x.details?.city || '&nbsp;';
        },
  
        title: [':name'],
  
        bottomRight: '#:id',
        bottomLeft: (x) => {
          if (x.received_amount) {
            const yearspan = `${this.threeYears()}&nbsp;-&nbsp;${this.thisYear()}`;
            const amount =  `${this.format_number(x.received_amount)}&nbsp;₪`;
            return `<span class='soft' title='הכנסות מהמדינה'>(${yearspan})</span><strong>${amount}</strong>`;
          }
          return '';
        }, 
  
        bodyStyle: ['borders-solid'],
        bodyBorderColor: '#CADAEC',
      },
    // Associations
    'org/association': <Parameter>{
      primaryColor: '#235000',
      bgColor: '#ffffff',

      topRight: (x) => {
        return `<strong>${x.kind_he}</strong>`;
      },
      topLeft: (x) => {
        return x.details?.city || x.details?.address_city || '&nbsp;';
      },

      title: [':name'],
      subtitle: (x) => {
        if (x.details?.objective && x.details?.objective.length > 40) {
          return x.details?.objective;
        }
        return null;
      },

      bottomRight: '#:id',
      bottomLeft: (x) => {
        if (x.received_amount) {
          const yearspan = `${this.threeYears()}&nbsp;-&nbsp;${this.thisYear()}`;
          const amount =  `${this.format_number(x.received_amount)}&nbsp;₪`;
          return `<span class='soft' title='הכנסות מהמדינה'>(${yearspan})</span><strong>${amount}</strong>`;
        } else if (x.details?.yearly_turnover) {
          const amount =  `${this.format_number(x.details?.yearly_turnover)}&nbsp;₪`;
          return `<span class='soft'>מחזור שנתי:</span><strong>${amount}</strong>`;
        }
        return '';
      }, 

      bodyStyle: ['borders-solid'],
      bodyBorderColor: '#abba9f',
    },
    // // Municipalities
    'org/municipality': <Parameter>{
      primaryColor: '#564a2a',
      bgColor: '#ffffff',

      topRight: (x) => {
        return `<strong>${x.details?.status_municipal_2015}</strong>`;
      },
      topLeft: (x) => {
        if (x.details && x.details?.district_2015?.indexOf('אזור') < 0) {
          return `מחוז ${x.details?.district_2015}`;
        } else {
          return x.details?.district_2015;
        }  
      },

      title: [':name'],

      bottomRight: '#:id',
      bottomLeft: (x) => {
        if (x.received_amount) {
          const yearspan = `${this.threeYears()}&nbsp;-&nbsp;${this.thisYear()}`;
          const amount =  `${this.format_number(x.received_amount)}&nbsp;₪`;
          return `<span class='soft' title='הכנסות מהמדינה'>(${yearspan})</span><strong>${amount}</strong>`;
        }
        return '';
      }, 

      bodyStyle: ['borders-solid'],
      bodyBorderColor: '#aaa595',
    },      
    // // Other entities
    'org': <Parameter>{
      primaryColor: '#444444',
      bgColor: '#ffffff',

      topRight: (x) => {
        if (x.details?.primary_type) {
          return `<strong>${ x.kind_he }</strong> (${x.details?.primary_type})`;
        } else {
          return `<strong>${x.kind_he}</strong>`;
        }
      },

      topLeft: (x) => {
        const ppp = parseInt(x.details?.city, 10);
        if (Number.isNaN(ppp)) {
          return x.details?.city || null;
        }
        return null;
      },
      title: [':name'],

      bottomRight: '#:id',
      bottomLeft: (x) => {
        if (x.received_amount) {
          const yearspan = `${this.threeYears()}&nbsp;-&nbsp;${this.thisYear()}`;
          const amount =  `${this.format_number(x.received_amount)}&nbsp;₪`;
          return `<span class='soft' title='הכנסות מהמדינה'>(${yearspan})</span><strong>${amount}</strong>`;
        }
        return '';
      }, 

      bodyStyle: ['borders-solid'],
      bodyBorderColor: '#cccccc',
    },
    // // BUDGET ITEMS
    'budget': <Parameter>{
      primaryColor: '#45375B',
      bgColor: '#ffffff',

      topRight: (x) => {
        const bc = x['nice-breadcrumbs'] || ('' + x['year']);
        const parts = bc.split(' / ');
        return `<strong>${parts[0]}</strong><span class='soft'>${bc.substring(parts[0].length)}</span>`;
      },
      topLeft: (x) => x['nice-category'] || '&nbsp;',
      topLeftIcon: 'circle',

      title: [':title'],

      bottomRight: ':nice-code',
      bottomLeft: (x) => `<strong>${this.format_number(x.net_revised || x.net_allocated)}&nbsp;₪</strong>`, 

      bodyStyle: ['color-center', 'borders-solid'],
      bodyBorderColor: '#CBC2DE',
      bodyBgColor: '#FAF7FF',
    },
    // // TRANSACTIONS
    // Contracts:
    'contract-spending': <Parameter>{
      primaryColor: '#313E69',
      bgColor: '#ffffff',

      topRight: '<strong>התקשרות רכש</strong>',
      topLeft: (x) => {
        const paid = (x['executed'] / x['volume'] * 100).toFixed(0) + '%';
        if (x.contract_is_active) {
          return `<strong>פעילה</strong> (עד כה שולמו ${paid})`;
        } else {
          return `<strong>הסתיימה</strong> (סה״כ שולמו ${paid})`;
        }
      },

      title: [
        ':purpose',
        (x) => {
          const partyFrom = x.publisher_name;
          const partyTo = x['entity_name'] || x['supplier_name'][0];
          return `${partyFrom} <span class='arrow left-solid'></span> ${partyTo}`;
        }
      ],

      bottomRight: (x) => this.contractPeriodDetails(x),
      bottomLeft: (x) => `<strong>${this.format_number(x['volume'])}&nbsp;₪</strong>`,

      bodyStyle: ['color-top', 'borders-dashing'],
      bodyBorderColor: '#E5DFDA',
      bodyBgColor: '#FFFDFA',
    },
    // // Supports:
    'supports': <Parameter>{
      primaryColor: '#313E69',
      bgColor: '#ffffff',

      topRight: (x) => {
        const kind = x['request_type'] === 'א3' ? '3' + 'א' : x['request_type'];
        return `<strong>תמיכה תקציבית</strong> (${kind})`;
      },
      topLeft: (x) => {
        const payment = this.lastSupportPayment(x);
        const paid = (payment['amount_paid'] / payment['amount_approved'] * 100).toFixed(0) + '%';
        return `${paid} ביצוע`;
      },

      title: [
        (x) => this.lastSupportPayment(x)['support_title'],
        (x) => {
          const partyFrom = this.lastSupportPayment(x)['supporting_ministry'];
          const partyTo = x['entity_name'] || x['recipient'];
          return `${partyFrom} <span class='arrow left-solid'></span> ${partyTo}`;
        }
      ],

      bottomRight: (x) => this.supportPeriodDetails(x),
      bottomLeft: (x) => `<strong>${this.format_number(x['amount_total'])}&nbsp;₪</strong>`,

      bodyStyle: ['color-top', 'borders-dashing'],
      bodyBorderColor: '#E5DFDA',
      bodyBgColor: '#FFFDFA',
    },
    // OPEN CALLS
    // Exemptions:
    'tenders/exemptions': <Parameter>{
      primaryColor: '#313E69',
      bgColor: '#ffffff',

      topRight: '<strong>:tender_type_he</strong>',
      topLeft: ':simple_decision_long',

      title: [
        ':description',
        (x) => {
          const partyFrom = x.publisher || '';
          const partyTo = x.awardees_text || '';
          return `${partyFrom} <span class='arrow left-dashed'></span> ${partyTo}`;
        }
      ],

      bottomRight: (x) => {
        if (x.last_update_date) {
          return `עודכן לאחרונה: ${dayjs(x['last_update_date']).format('DD/MM/YYYY')}`;
        }
        return null;
      },
      bottomLeft: (x) => x['volume'] ? `<strong>${this.format_number(x['volume'])}&nbsp;₪</strong>` : null, 

      bodyStyle: ['color-top', 'color-bottom', 'borders-dashing'],
      bodyBorderColor: '#E5DFDA',
      bodyBgColor: '#FFFDFA',
    },
    // Tenders:
    'tenders': <Parameter>{
      primaryColor: '#313E69',
      bgColor: '#ffffff',

      topRight: '<strong>:tender_type_he</strong>',
      topLeft: (x) => {
        const remainingTime = this.remainingTime(x);
        if (!remainingTime) {
          return x.simple_decision;
        } else {
          return remainingTime;
        }
      },
      topLeftIcon: (x) => {
        const remainingTime = this.remainingTime(x);
        if (!remainingTime) {
          return null;
        } else {
          return 'notice';
        }
      },

      title: [
        ':description',
        (x) => {
          const partyFrom = x.publisher || '';
          const partyTo = x.awardees_text || '';
          return `${partyFrom} <span class='arrow left-dashed'></span> ${partyTo}`;
        }
      ],

      bottomRight: (x) => {
        if (x.last_update_date) {
          return `עודכן לאחרונה: ${dayjs(x['last_update_date']).format('DD/MM/YYYY')}`;
        }
        return null;
      },
      bottomLeft: (x) => x['volume'] ? `<strong>${this.format_number(x['volume'])}&nbsp;₪</strong>` : null, 

      bodyStyle: ['color-top', 'color-bottom', 'borders-dashing'],
      bodyBorderColor: '#E5DFDA',
      bodyBgColor: '#FFFDFA',
    },
    'muni_tenders': <Parameter>{
      primaryColor: '#313E69',
      bgColor: '#ffffff',

      topRight: '<strong>:tender_type_he</strong>',
      topLeft: (x) => {
        const remainingTime = this.remainingTime(x);
        if (!remainingTime) {
          if (x.claim_date) {
            return `מועד הגשה: ${dayjs(x['claim_date']).format('DD/MM/YYYY')}`;
          }
        } else {
          return remainingTime;
        }
        return null;
      },
      topLeftIcon: (x) => {
        const remainingTime = this.remainingTime(x);
        if (!remainingTime) {
          return null;
        } else {
          return 'notice';
        }
      },

      title: [
        ':description',
        (x) => {
          const partyFrom = x.publisher || '';
          return `${partyFrom} <span class='arrow left-dashed'></span>`;
        }
      ],

      bottomRight: (x) => {
        if (x.last_update_date) {
          return `עודכן לאחרונה: ${dayjs(x['last_update_date']).format('DD/MM/YYYY')}`;
        }
        return null;
      },
      bottomLeft: (x) => x['volume'] ? `<strong>${this.format_number(x['volume'])}&nbsp;₪</strong>` : null, 

      bodyStyle: ['color-top', 'color-bottom', 'borders-dashing'],
      bodyBorderColor: '#E5DFDA',
      bodyBgColor: '#FFFDFA',
    },
    // Calls for Bids:
    'calls_for_bids': <Parameter>{
      primaryColor: '#313E69',
      bgColor: '#ffffff',

      topRight: '<strong>:tender_type_he</strong>',
      topLeft: (x) => {
        const remainingTime = this.remainingTime(x);
        if (!remainingTime) {
          return x.decision;
        } else {
          return remainingTime;
        }
      },
      topLeftIcon: (x) => {
        const remainingTime = this.remainingTime(x);
        if (!remainingTime) {
          return null;
        } else {
          return 'notice';
        }
      },

      title: [
        ':page_title',
        (x) => {
          const partyFrom = x.publisher || '';
          return `${partyFrom} <span class='arrow left-dashed'></span>`;
        }
      ],

      bottomRight: (x) => {
        if (x.start_date) {
          return `תאריך פרסום: ${dayjs(x['start_date']).format('DD/MM/YYYY')}`;
        }
        return null;
      },
      bottomLeft: (x) => x['volume'] ? `<strong>${this.format_number(x['volume'])}&nbsp;₪</strong>` : null, 

      bodyStyle: ['color-top', 'color-bottom', 'borders-dashing'],
      bodyBorderColor: '#E5DFDA',
      bodyBgColor: '#FFFDFA',
    },
    // Support Criteria:
    'support_criteria': <Parameter>{
      primaryColor: '#3C4B7C',
      bgColor: '#ffffff',

      topRight: '<strong>:tender_type_he</strong>',
      topLeft: this.remainingTime,
      topLeftIcon: (x) => {
        const remainingTime = this.remainingTime(x);
        if (!remainingTime) {
          return null;
        } else {
          return 'notice';
        }
      },

      title: [
        ':page_title',
        (x) => {
          const partyFrom = x.publisher || '';
          if (partyFrom.length > 0) {
            return `${partyFrom} <span class='arrow left-dashed'></span>`;
          }
          return null;
        }
      ],
      subtitle: (x) => {
        if (x.text) {
          return this.cleanHtml(x.text);
        }
        return null;
      },

      bottomRight: (x) => x['start_date'] ? `תאריך פרסום: ${dayjs(x.start_date).format('DD/MM/YYYY')}` : null,

      bodyStyle: ['icon-gov'],
      bodyBorderColor: '#CADAEC',
      bodyBgColor: '#ffffff',
    },
    // // PEOPLE:
    // People
    'people': <Parameter>{
      primaryColor: '#3C4B7C',
      bgColor: '#ffffff',

      topRight: '<strong>אנשים</strong>',

      title: [':key'],
      subtitle: (x) => {
        if (x.text) {
          return this.cleanHtml(x.text);
        }
        return null;
      },

      bottomRight: (x) => x.details.length > 1 ? `${x.details.length} רשומות` : 'רשומה אחת',

      bodyStyle: ['icon-person'],
      bodyBorderColor: '#CADAEC',
      bodyBgColor: '#ffffff',
    },
    // // TRANSFERS:
    // Budget Changes
    'national-budget-changes': <Parameter> {
      primaryColor: '#45375B',
      bgColor: '#ffffff',

      topRight: (x) => {
        if (x.change_title && x.change_title.length > 0) {
          return `העברה תקציבית (${x.change_title[0]})`;
        } else {
          return 'העברה תקציבית';
        }
      },
      topLeft: (x) => {
        if (x['pending'] && x['pending'][0]) {
          return '<strong>ממתינה לאישור</strong>';
        } else if (x['date'] && x['date'].length > 0) {
            return dayjs(x['date'][0]).format('DD/MM/YYYY');
        }
        return null
      },
      topLeftIcon: (x) => {
        if (x['pending'] && x['pending'][0]) {
          return 'notice';
        }
        return null;
      },
      title: [
        ':page_title',
        (x) => {
            const partyFrom = x['summary']['from'].map((i: any[]) => i[2]).join(', ');
            const partyTo = x['summary']['to'].map((i: any[]) => i[2]).join(', ');
            if (partyTo.length && partyFrom.length) {
              return `${partyTo} <span class='arrow right-dashed'></span> ${partyFrom}`;              
            } else if (partyTo.length) {
              return `<span class='arrow left-dashed'></span> ${partyTo}`;
            } else if (partyFrom.length) {
              return `<span class='arrow right-dashed'></span> ${partyFrom} `;
            }
            return '';
        }
      ],

      bottomRight: (x) => {
        if (x.change_type_name && x.change_type_name.length > 0) {
          return `${x.change_type_name}: ${x.transaction_id}`;
        } else {
          return x.transaction_id;
        }
      },
      bottomLeft: (x) => `<strong>${this.format_number(x.amount)}&nbsp;₪</strong>`,

      bodyStyle: ['color-center', 'borders-solid'],
      bodyBorderColor: '#CBC2DE',
      bodyBgColor: '#FAF7FF',
    },
    // // PUBLICATIONS
    // Government Decisions
    'gov_decisions': <Parameter>{
      primaryColor: '#3C4B7C',
      bgColor: '#ffffff',

      topRight: '<strong>:policy_type</strong>',
      topLeft: (x) => x.office + (x['unit'] && x['unit'].length < 36 ? ' / ' + x.unit : ''),

      title: [':title'],
      subtitle: (x) => {
        if (x.text) {
          return this.cleanHtml(x.text);
        }
        return null;
      },

      bottomRight: (x) => x['procedure_number_str'] ? `#${x.procedure_number_str}` : null,
      bottomLeft: (x) => dayjs(x['publish_date']).format('DD/MM/YYYY'),

      bodyStyle: ['icon-gov'],
      bodyBorderColor: '#CADAEC',
      bodyBgColor: '#ffffff',
    },
    // // ACTIVITIES
    // Government Activities
    'activities': <Parameter>{
      primaryColor: '#45375B',
      bgColor: '#ffffff',

      topRight: '<strong>:kind_he</strong>',
      topLeft: (x) => x['office'] + '/' + x['unit'] + (x['subunit'] ? '/' + x['subunit'] : ''),

      title: [':name'],
      subtitle: ':description',

      bottomLeft: (x: any) => {
        const h = x['manualBudget'] || [];
        for (const i of h) {
          if (i.approved) {
            return `(${i.year}) <strong>${this.format_number(i.approved)}&nbsp;₪</strong>`;
          }
        }
        return null;
      },

      bodyStyle: ['color-center', 'borders-solid'],
      bodyBorderColor: '#CBC2DE',
      bodyBgColor: '#FAF7FF',      
    },
    // // REPORTS
    // NGO Activity Report
    'reports/ngo-activity-report': <Parameter>{
      primaryColor: '#180a42',
      bgColor: '#ffffff',

      topRight: 'תחום פעילות',

      title: [':title'],

      bottomRight: '<strong>מספר ארגונים:</strong> :details.report.total.total_amount',

      bodyStyle: ['color-center', 'borders-solid'],
      bodyBorderColor: '#fe8255',
      bodyBgColor: '#FAF7FF',
    },
    // },
    // District Report
    'reports/ngo-district-report': <Parameter>{
      primaryColor: '#180a42',
      bgColor: '#ffffff',

      topRight: 'אזור פעילות',

      title: [':title'],

      bottomRight: '<strong>מספר ארגונים:</strong> :details.report.total.count',

      bodyStyle: ['color-center', 'borders-solid'],
      bodyBorderColor: '#fe8255',
      bodyBgColor: '#FAF7FF',
    },
    'muni_budgets': <Parameter>{
      primaryColor: '#45375B',
      bgColor: '#ffffff',

      topRight: (x) => {
        const bc = x['nice-breadcrumbs'] || ('' + x['year']);
        const parts = bc.split(' / ');
        return `<strong>${parts[0]}</strong><span class='soft'>${bc.substring(parts[0].length)}</span>`;
      },
      topLeft: (x) => x['nice-category'] || '&nbsp;',
      topLeftIcon: 'circle',

      title: [':title'],

      bottomRight: 'קוד סעיף: :nice-code',
      bottomLeft: (x) => `<strong>${this.format_number(x.allocated)}&nbsp;₪</strong>`,

      bodyStyle: ['color-center', 'borders-solid'],
      bodyBorderColor: '#CBC2DE',
      bodyBgColor: '#FAF7FF',
    },
  };

  public p: Parameter;

  constructor(private globalSettings: GlobalSettingsService, private sanitizer: DomSanitizer, private ps: PlatformService) { }

  ngOnInit() {
    const parts = this.item.source.doc_id.split('/');
    this.p = {} as Parameter;
    let template: any = (
      this.PARAMETERS[parts[0] + '/' + parts[1]] ||
      this.PARAMETERS[parts[0]] ||
      this.PARAMETERS['']
    );
    if (template) {
      this.p = this.processObject(template);
    }
    if (this.bare) {
      this.p.primaryColor = 'black';
      this.p.bgColor = 'white';
    }
  }

  processObject(obj: any): any {
    if (typeof obj === 'string') {
      return obj.replace(/:([-a-z0-9_.]+)/g, (_, x) => this.get(x));
    }
    if (typeof obj === 'function') {
      return obj(this.item.source);
    }
    if (Array.isArray(obj)) {
      return obj.map((x) => this.processObject(x));
    }
    if (typeof obj === 'object') {
      const r: any = {};
      for (const k of Object.keys(obj)) {
        r[k] = this.processObject(obj[k]);
      }
      return r;
    }
    return null;
  }

  threeYears() {
    const dt = new Date();
    dt.setDate(dt.getDate() - 180);
    return dt.getFullYear() - 3;
  }

  thisYear() {
    const dt = new Date();
    return dt.getFullYear();
  }

  format_number(x: number) {
    if (x) {
      let fracDigits = 0;
      if (x < 1000) {
        fracDigits = 2;
      }
      return '<span class="number">' +
                x.toLocaleString('en-US', {style: 'decimal',
                                           maximumFractionDigits: fracDigits}) +
             '</span>';
    } else {
      return '-';
    }
  }

  get_field(item: any, parts: string[]) {
    while (item && parts.length > 0) {
      const part = parts.shift();
      if (!!part) {
        item = item[part];
      }
    }
    return item;
  }

  get(field: string, default_value?: string) {
    if (field) {
      return this.get_field(this.item.source, field.split('.')) || default_value || '';
    }
    return default_value || '';
  }

  fadeoff(primary?: boolean) {
    if (primary) {
      return `linear-gradient(to left, ${this.p.bgColor}00 0%, ${this.p.bgColor}ff 100%)`;
    } else {
      return `linear-gradient(to left, ${this.p.primaryColor}00 0%, ${this.p.primaryColor}ff 100%)`;
    }
  }

  socialmapAmount() {
    return this.globalSettings.themeId === 'socialmap' && this.item.source.details['yearly_turnover'];
  }

  contractPeriodDetails(x: any) {
    const r: string[] = [];
    if (x['order_date']) {
      r.push('תקופת ההתקשרות');
      let rr = dayjs(x['order_date']).format('DD/MM/YYYY') + ' - ';
      if (x['end_date']) {
        rr += dayjs(x['end_date']).format('DD/MM/YYYY');
      } else if (x['contract_is_active']) {
        rr += 'התקשרות פעילה';
      } else {
        rr += 'התקשרות לא פעילה';
      }
      r.push(rr);
    } else if (x['contract_is_active']) {
      r.push('התקשרות פעילה');
    } else {
      r.push('התקשרות לא פעילה');
    }
    return r.join(' ');
  }

  supportPeriodDetails(x: any) {
    const lastYear = x['last_payment_year'];
    if (!lastYear || lastYear === x['year_requested']) {
      return `שנת תמיכה: ${x['year_requested']}`;
    } else {
      return `תקופת תמיכה: ${x['year_requested']} - ${lastYear}`;
    }
  }

  lastSupportPayment(x: any) {
    return x['payments'][x['payments'].length - 1];
  }

  routerLink() {
    const doc_id = this.item.source.doc_id;
    if (doc_id.indexOf('activities/gov_social_service') === 0) {
      return null;
    }
    return [`/i/${doc_id}`];
  }

  href() {
    const doc_id = this.item.source.doc_id;
    if (doc_id.indexOf('activities/gov_social_service') === 0) {
      const theme = (!this.bare && this.globalSettings.themeId) ? `&theme=${this.globalSettings.themeId}` : '';
      return this.sanitizer.bypassSecurityTrustUrl(`https://www.socialpro.org.il/i/${doc_id}?li=${this.index}${theme}`);
    }
    return null;
  }

  remainingTime(x: any) {
    if (x.claim_date) {
      const days = -dayjs().diff(dayjs(x.claim_date), 'days');
      if (days > 0) {
        if (days === 1) {
          return '<strong>יום אחד</strong> נותר להגשה';
        } else {
          return `<strong>${days} ימים</strong> נותרו להגשה`;
        }
      }
    }
    return null;
  }

  updateNotes() {
    this.updatedNotes.emit(this.notes);
  }

  stopEvent(event: Event) {
    event.stopPropagation();
    if (event.type === 'click') {
      event.preventDefault();
    }
  }

  cleanHtml(html: string) {
    if (this.ps.server()) {
      return '';
    }
    return new DOMParser().parseFromString(html, "text/html").documentElement.textContent;
  }
}
