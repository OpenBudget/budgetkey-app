import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription, ReplaySubject, from, mergeMap, map, first, switchMap, delay, fromEvent, throttleTime, forkJoin, interval, animationFrameScheduler } from 'rxjs';
import { BudgetKeyItemService } from '../../../budgetkey-item.service';
import { tableDefs } from './tables';
import { chartTemplates } from './charts';
import { GlobalSettingsService } from 'projects/budgetkey/src/app/common-components/global-settings.service';
import { PlatformService } from 'projects/budgetkey/src/app/common-components/platform.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'app-item-social-service-gov-unit',
    templateUrl: './item-social-service-gov-unit.component.html',
    styleUrls: ['./item-social-service-gov-unit.component.less'],
    standalone: false
})
export class ItemSocialServiceGovUnitComponent implements OnInit, AfterViewInit {

  @Input() item: any;

  @ViewChild('filtersElement') filtersElement: ElementRef;
  @ViewChild('tabs') tabsElement: ElementRef;
  @ViewChild('chartsSection') chartsSectionElement: ElementRef;
  stickyTop = '-80px';
  

  PAGE_LINKS = [
    {title: 'משרדי הממשלה', href: '/i/units/gov_social_service_unit/main'},
    {title: 'משרד הרווחה', href: '/i/units/gov_social_service_unit/welfare'},
    {title: 'משרד הבריאות', href: '/i/units/gov_social_service_unit/health'},
    {title: 'משרד החינוך', href: '/i/units/gov_social_service_unit/education'},
  ];   
  PAGE_FILTERS = [
    {title: 'אוכלוסיית היעד', id: 'target_audience'},
    {title: 'קבוצת גיל', id: 'target_age_group'},
    {title: 'תחום ההתערבות', id: 'subject', tooltip: 'תחומי התוכן או הנושאים שבהם מתמקד השירות'},
    {title: 'אופן ההתערבות', id: 'intervention', tooltip: 'הדרך או הצורה שבה ניתן השירות'},
    {title: 'סוג הליך מכרזי', id: 'tender_type', tooltip: 'הליך מכרזי רגיל או הליך של פטור ממכרז ופירוט של סוג המכרז/סוג הפטור'},
    {title: 'מודל תמחור', id: 'pricing_model', tooltip: 'האם נקבע מראש תעריף לאספקת השירות או שעל המציעים להגיש הצעת מחיר או מודל משולב'},
  ];
  COLORS = [
    '#038CA4', // 0
    '#A1767A', // 1
    '#84353D', // 2
    '#DB6B58', // 3
    '#DB8258', // 4
    '#9ED4C4', // 5
    '#81A351', // 6
    '#1A4F40', // 7
    '#CA7898', // 8
    '#BE4C9C', // 9
    '#763483', // 10
    '#E4CF43', // 11
  ];
  OTHER_COLOR_IDX = this.COLORS.length - 1;

  public parameters: any = {
    pricing_model: [
      {value: 'TRUE', display: 'הכל'},
      {value: `(tenders::text) like '%%"fixed"%%'`, display: 'מחיר קבוע'},
      {value: `(tenders::text) like '%%"proposal"%%'`, display: 'הצעת מחיר'},
      {value: `(tenders::text) like '%%"combined"%%'`, display: 'משולב'},
    ],
    tender_type: [
      {value: 'TRUE', display: 'הכל'},
      {value: `(tenders::text) like '%%"tender_type": "office"%%'`, display: 'מכרז (כל הסוגים)'},
      {value: `(tenders::text) like '%%"tender_type": "exemptions"%%'`, display: 'פטור (כל הסוגים)'},
    ].concat([
      'מכרז רגיל', 'מכרז סגור', 'מכרז מסגרת', 'מכרז מאגר',
    ].map((x) => { return {value: `(tenders::text) like '%%"sub_kind_he": "${x}"%%'`, display: x}; })).concat([
      'התקשרות המשך', 'ספק יחיד', 'מימוש אופציה', 'מיזם משותף', 'התקשרות עם רשות מקומית',
    ].map((x) => { return {value: `(tenders::text) like '%%"sub_kind_he": "${x}"%%'`, display: x + ' (פטור)'}; })).concat([
      'אחר'
    ].map((x) => { return {value: `(tenders::text) like '%%"sub_kind_he": "${x}"%%'`, display: x}; }))
  };
  private levelCond = 'TRUE';
  private levelKey = '';
  private groupByLvl: string|null = null;
  public subunits = null;
  private ready = new ReplaySubject<void>(1);
  public filters: any = {
    pricing_model: ['TRUE'],
    tender_type: ['TRUE']
  };
  public currentTab = 'services';
  public chartTemplates = chartTemplates;
  public charts: any = {};
  public tables = tableDefs;
  public replacements: any[] = [];
  public colorscheme = new ReplaySubject<any>(1);
  public xValues: any = {};
  public sticky = false;

  constructor(private api: BudgetKeyItemService, private globalSettings: GlobalSettingsService, public ps: PlatformService, private el: ElementRef) {
    const fields = ['subject', 'intervention', 'target_audience', 'target_age_group'];
    from(fields).pipe(
      mergeMap((field) => {
        return api.getDatarecords(field).pipe(
          map((results) => {
            results = results.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
            return {results, field};
          })
        );
      })
    ).subscribe(({results, field}) => {
      const params = this.processParams(results, field);
      this.parameters[field] = params;
      this.filters[field] = ['TRUE'];
      if (Object.keys(this.parameters).length === fields.length) {
        this.ready.next();
      }
    });
  }

  ngOnInit() {
    // console.log('ITEM', this.item);
    this.processLevel();
    this.fetchColorscheme();
    this.colorscheme.subscribe(() => {
      this.filtersChanged();
      if (this.item.office && !this.item.unit) {
        this.item.unit = '';
        this.subunits = this.xValues[this.item.office];
      }
    });
    this.ps.browser(() => {
      if (window.innerWidth < 600) {
        alert('מומלץ לפתוח ממחשב שולחני לשימוש מיטבי');
      }
    });
  }

  ngAfterViewInit() {
    this.ps.browser(() => {
      this.ready.pipe(
        first(),
        switchMap(() => this.colorscheme),
        delay(100)
      ).subscribe(() => {
        const scrollable: Element | null= window.document.querySelector('.scrollable');
        if (scrollable) {
          fromEvent(scrollable, 'scroll')
          .pipe(
            untilDestroyed(this),
            throttleTime(500, animationFrameScheduler),
          ).subscribe(() => {
            console.log('SCROLL');
            this.updateSticky();
          });            
        }
    });
    });
  }

  setCurrentTab(tab: string) {
    this.currentTab = tab;
    this.chartsSectionElement.nativeElement.focus();
  }

  updateSticky() {
    const top = this.filtersElement.nativeElement.getBoundingClientRect().top - 56;
    if (!this.sticky && top < 1) {
      this.sticky = true;
    } else if (this.sticky && top > 56) {
      this.sticky = false;
    }
    if (this.filtersElement && this.filtersElement.nativeElement) {
      const el = this.filtersElement.nativeElement;
      const top = el.offsetTop;
      this.stickyTop = `-${top}px`;
    }
  }

  fetchColorscheme() {
    const query = `select office, unit, subunit from all_activities group by 1, 2, 3 order by 1, 2, 3`;
    this.api.getItemData(
      query, ['value', 'value', 'value'], [this.formatter, this.formatter, this.formatter]
    ).pipe(
      map((x: any) => x.rows),
    ).subscribe((rows) => {
      const scheme: any = {default: 0, '': 0};
      for (const row of rows) {
        const office = row.office;
        this.xValues.offices = this.xValues.offices || [];
        if (this.xValues.offices.indexOf(office) === -1) {
          scheme[office] = this.xValues.offices.length + 1;
          this.xValues.offices.push(office);
        }
        const unit = row.unit;
        if (unit) {
          this.xValues[office] = this.xValues[office] || [];
          if (this.xValues[office].indexOf(unit) === -1) {
            scheme[`${office}|${unit}`] = this.xValues[office].length + 1;
            this.xValues[office].push(unit);
          }

          const subunit = row.subunit || 'אחר';
          const key = office + '|' + unit;
          this.xValues[key] = this.xValues[key] || [];
          if (this.xValues[key].indexOf(subunit) === -1) {
            scheme[`${key}|${subunit}`] = this.xValues[key].length + 1;
            this.xValues[key].push(subunit);
          }
        }
      }
      const orgSizes = ['1', '2-5', '6+'];
      const orgSizesIdx = [8, 9, 10];
      for (const i in orgSizes) {
        scheme[orgSizes[i]] = orgSizesIdx[i];
      }
      const orgKinds = ['עסקי', 'מגזר שלישי', 'רשויות מקומיות', 'משולב'];
      const orgKindsIdx = [5, 0, 6, 7];
      for (const i in orgKinds) {
        scheme[orgKinds[i]] = orgKindsIdx[i];
      }
      const offices = ['משרד החינוך', 'משרד הרווחה', 'משרד הבריאות'];
      const officeIdx = [9, 6, 4];
      for (const i in offices) {
        scheme[offices[i]] = officeIdx[i];
      }
      const exemptionKinds = ['מימוש אופציה', 'ספק יחיד', 'התקשרות המשך', 'מיזם משותף', 'התקשרות עם רשות מקומית', 'מכרז סגור'];
      const exemptionKindsIdx = [5, 10, 1, 7, 9, 11];
      for (const i in exemptionKinds) {
        scheme[exemptionKinds[i]] = exemptionKindsIdx[i];
      }
      const tenderTypes = ['מכרז פומבי', 'התקשרות בפטור במכרז או בהליך תחרותי אחר', 'פרסום כוונה להתקשרות', 'פרסום מיזם ללא כוונת רווח', 'פניה לקבלת מידע RFI', 'קול קורא להקמת/עדכון רשימת מציעים (מאגר'];
      const tenderTypesIdx = [2, 3, 5, 8, 1, 11];
      for (const i in tenderTypes) {
        scheme[tenderTypes[i]] = tenderTypesIdx[i];
      }
      const model = ['מחיר קבוע (תעריף)', 'הצעת מחיר'];
      const modelIdx = [2, 5];
      for (const i in model) {
        scheme[model[i]] = modelIdx[i];
      }
      scheme['אחר'] = this.OTHER_COLOR_IDX;
      this.colorscheme.next(scheme);
      this.colorscheme.complete();
    });
  }

  processParams(records: any[], field: string) {
    const params = [];
    const dflt =  'הכל';
    params.push({
      display: dflt,
      value: 'TRUE'
    });
    for (const rec of records) {
      params.push({
        display: rec['name'],
        value: `(${field}::text) LIKE '%%"${rec.name}"%%'`
      })
    }
    return params;
  }

  processLevel() {
    const levelCondParts = [];
    const levelKeyParts = [];
    this.groupByLvl = null;
    for (const lvl of ['office', 'unit', 'subunit', 'subsubunit']) {
      if (this.item[lvl]) {
        levelCondParts.push(`${lvl} = '${this.item[lvl]}'`);
        levelKeyParts.push(this.item[lvl]);
      } else if (!this.groupByLvl) {
        this.groupByLvl = lvl;
      } else {
        break;
      }
    }
    this.levelCond = levelCondParts.join(' AND ') || 'TRUE';
    this.levelKey = levelKeyParts.join('|');
    this.filtersChanged();
  }

  formatter(f: string) {
    return (row: any) => '' + row[f];
  }

  filterExpression(k: string) {
    return '(' + this.filters[k].join(' OR ') + ')';
  }

  calcWhere() {
    let where = '';
    for (const k of Object.keys(this.filters)) {
      const filter = this.filterExpression(k);
      where += ` ${filter} AND`;
    }
    where += ' ' + this.levelCond;
    where = where.split(' (TRUE) AND').join('');
    where = where.split(' TRUE AND').join('');
    return where;
  }

  filtersChanged() {
    const where = this.calcWhere();
    for (const ct of this.chartTemplates) {
      this.refreshChart(ct, where);
    }
    this.replacements = [
      {from: ':where', to: where},
      {from: ':tender-type', to: this.filterExpression('tender_type')},
      {from: ':pricing-model', to: this.filterExpression('pricing_model')},
    ];
  }

  clearFilters() {
    for (const k of Object.keys(this.filters)) {
      this.filters[k] = ['TRUE'];
    }
    this.item.unit = '';
    this.processLevel();
  }

  sum(arr: number[]): number {
    return arr.reduce(function(a, b){
      return a + b;
    }, 0);
  }

  replaceAll(query: string, conf: any[]) {
    for (const {from, to} of conf) {
      query = query.split(from).join(to);
    }
    return query;
  }

  prepareChartQuery(query: string, where: string) {
    const q = this.replaceAll(
      query,
      [
        {from: ':where', to: where},
        {from: ':org-field', to: `coalesce("${this.groupByLvl}", 'אחר')`},
      ]
    );
    return btoa(encodeURIComponent(q).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16))));
  }

  refreshChart(ct: any, where: string) {
    if (this.ps.server()) {
      return;
    }
    const query = this.prepareChartQuery(ct.query, where);
    forkJoin([
        this.colorscheme,
        this.api.getItemData(
          query, ['משרד', 'value'], [this.formatter('משרד'), this.formatter('value')]
        )
    ]).subscribe(([scheme, result]: any[]) => {
      const layout = ct.layout;
      layout.margin = {t: 20};
      layout.height = 400;
      layout.bargap = 0.5;
      if (layout.xaxis && layout.xaxis.title === 'משרד / יחידה') {
        layout.xaxis.title = {
          text: layout.xaxis.title,
          standoff: 100
        }
      } else {
        layout.margin.b = 40;
      }
      const rows = result.rows || [];
      if (result.error) {
        console.log('ERROR', query, result.error);
      }
      if (ct.subtitle) {
        if (ct.subtitleQuery) {
          this.api.getItemData(
            this.prepareChartQuery(ct.subtitleQuery, where),
            ['משרד', 'value'], [this.formatter('משד'), this.formatter('value')]
          ).subscribe((result: any) => {
            const rows = result.rows || [];
            this.setSubtitle(ct, rows);
          });
        } else {
          this.setSubtitle(ct, rows);
        }
      }
      let x_values = [];
      if (ct.kind === 'org') {
        let key = 'offices';
        if (this.item.office) {
          key = this.item.office;
          if (this.item.unit) {
            key += '|' + this.item.unit;
          }
        }
        x_values = this.xValues[key];
      } else {
        console.log('UNKNOWN CHART KIND', ct.title)
      }
      const data = ct.data(rows, ct, x_values);
      for (const d of data) {
        let color: string | null = null;
        if (scheme.hasOwnProperty(d.name)) {
          color = this.COLORS[scheme[d.name]];
        } else if (scheme.hasOwnProperty(`${this.levelKey}|${d.name}`)) {
          color = this.COLORS[scheme[`${this.levelKey}|${d.name}`]];
        }
        if (!color) {
          console.log('MISSING VALUE', d.name)
          color = this.COLORS[this.COLORS.length - 1];
        }
        d.marker = {
          color: color,
          opacity: 1,
          line: {
            color: color,
            opacity: 1,
          }
        };
      }
      this.charts[ct.id] = {layout, data, downloadHeaders: ct.downloadHeaders, query: query, title: ct.title};
    });
  }

  setSubtitle(ct: any, rows: any[]) {
    if (rows && rows.length) {
      const total = this.sum(rows.map((x) => x[ct.y_field])).toLocaleString('he-IL', {maximumFractionDigits: 0});
      ct._subtitle = ct.subtitle
                          .replace(':total', total)
                          .replace(':max-year', rows[0].max_year)
                          .replace(':min-year', rows[0].min_year)
                          .replace(':org', this.item.breadcrumbs);
    } else {
      ct._subtitle = 'לא נמצאו נתונים';
    }
  }

  processTitles(ct: any) {
    if (ct.titleTooltip) {
      return `<span class='bk-tooltip-anchor'>${ct.title}<span class='bk-tooltip'>${ct.titleTooltip}</span></span>`;
    } else {
      return ct.title;
    }
  }

}
