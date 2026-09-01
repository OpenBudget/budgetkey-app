// measurement tab - purple icon core-header-in-label-col
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

const MEASUREMENT_QUERY = `SELECT
  count(*) as total,
  sum(case when principle_score_1 < 0.35 then 1 else 0 end) as p1_low,
  sum(case when principle_score_1 >= 0.35 and (principle_score_1 < 0.70 or low_answer_count_1 > 1) then 1 else 0 end) as p1_med,
  sum(case when principle_score_1 >= 0.70 and low_answer_count_1 <= 1 then 1 else 0 end) as p1_high,
  sum(case when principle_score_2 < 0.35 then 1 else 0 end) as p2_low,
  sum(case when principle_score_2 >= 0.35 and (principle_score_2 < 0.70 or low_answer_count_2 > 1) then 1 else 0 end) as p2_med,
  sum(case when principle_score_2 >= 0.70 and low_answer_count_2 <= 1 then 1 else 0 end) as p2_high,
  sum(case when principle_score_3 < 0.35 then 1 else 0 end) as p3_low,
  sum(case when principle_score_3 >= 0.35 and (principle_score_3 < 0.70 or low_answer_count_3 > 1) then 1 else 0 end) as p3_med,
  sum(case when principle_score_3 >= 0.70 and low_answer_count_3 <= 1 then 1 else 0 end) as p3_high,
  sum(case when principle_score_4 < 0.35 then 1 else 0 end) as p4_low,
  sum(case when principle_score_4 >= 0.35 and (principle_score_4 < 0.70 or low_answer_count_4 > 1) then 1 else 0 end) as p4_med,
  sum(case when principle_score_4 >= 0.70 and low_answer_count_4 <= 1 then 1 else 0 end) as p4_high,
  sum(case when principle_score_5 < 0.35 then 1 else 0 end) as p5_low,
  sum(case when principle_score_5 >= 0.35 and (principle_score_5 < 0.70 or low_answer_count_5 > 1) then 1 else 0 end) as p5_med,
  sum(case when principle_score_5 >= 0.70 and low_answer_count_5 <= 1 then 1 else 0 end) as p5_high,
  sum(case when principle_score_6 < 0.35 then 1 else 0 end) as p6_low,
  sum(case when principle_score_6 >= 0.35 and (principle_score_6 < 0.70 or low_answer_count_6 > 1) then 1 else 0 end) as p6_med,
  sum(case when principle_score_6 >= 0.70 and low_answer_count_6 <= 1 then 1 else 0 end) as p6_high,
  sum(case when principle_score_1_1 < 0.35 then 1 else 0 end) as p1_1_low,
  sum(case when principle_score_1_1 >= 0.35 and principle_score_1_1 < 0.70 then 1 else 0 end) as p1_1_med,
  sum(case when principle_score_1_1 >= 0.70 then 1 else 0 end) as p1_1_high,
  sum(case when principle_score_1_2 < 0.35 then 1 else 0 end) as p1_2_low,
  sum(case when principle_score_1_2 >= 0.35 and principle_score_1_2 < 0.70 then 1 else 0 end) as p1_2_med,
  sum(case when principle_score_1_2 >= 0.70 then 1 else 0 end) as p1_2_high,
  sum(case when principle_score_1_3 < 0.35 then 1 else 0 end) as p1_3_low,
  sum(case when principle_score_1_3 >= 0.35 and principle_score_1_3 < 0.70 then 1 else 0 end) as p1_3_med,
  sum(case when principle_score_1_3 >= 0.70 then 1 else 0 end) as p1_3_high,
  sum(case when principle_score_1_4 < 0.35 then 1 else 0 end) as p1_4_low,
  sum(case when principle_score_1_4 >= 0.35 and principle_score_1_4 < 0.70 then 1 else 0 end) as p1_4_med,
  sum(case when principle_score_1_4 >= 0.70 then 1 else 0 end) as p1_4_high,
  sum(case when principle_score_2_1 < 0.35 then 1 else 0 end) as p2_1_low,
  sum(case when principle_score_2_1 >= 0.35 and principle_score_2_1 < 0.70 then 1 else 0 end) as p2_1_med,
  sum(case when principle_score_2_1 >= 0.70 then 1 else 0 end) as p2_1_high,
  sum(case when principle_score_2_2 < 0.35 then 1 else 0 end) as p2_2_low,
  sum(case when principle_score_2_2 >= 0.35 and principle_score_2_2 < 0.70 then 1 else 0 end) as p2_2_med,
  sum(case when principle_score_2_2 >= 0.70 then 1 else 0 end) as p2_2_high,
  sum(case when principle_score_3_1 < 0.35 then 1 else 0 end) as p3_1_low,
  sum(case when principle_score_3_1 >= 0.35 and principle_score_3_1 < 0.70 then 1 else 0 end) as p3_1_med,
  sum(case when principle_score_3_1 >= 0.70 then 1 else 0 end) as p3_1_high,
  sum(case when principle_score_3_2 < 0.35 then 1 else 0 end) as p3_2_low,
  sum(case when principle_score_3_2 >= 0.35 and principle_score_3_2 < 0.70 then 1 else 0 end) as p3_2_med,
  sum(case when principle_score_3_2 >= 0.70 then 1 else 0 end) as p3_2_high,
  sum(case when principle_score_6_1 < 0.35 then 1 else 0 end) as p6_1_low,
  sum(case when principle_score_6_1 >= 0.35 and principle_score_6_1 < 0.70 then 1 else 0 end) as p6_1_med,
  sum(case when principle_score_6_1 >= 0.70 then 1 else 0 end) as p6_1_high,
  sum(case when principle_score_6_2 < 0.35 then 1 else 0 end) as p6_2_low,
  sum(case when principle_score_6_2 >= 0.35 and principle_score_6_2 < 0.70 then 1 else 0 end) as p6_2_med,
  sum(case when principle_score_6_2 >= 0.70 then 1 else 0 end) as p6_2_high,
  sum(case when principle_score_6_3 < 0.35 then 1 else 0 end) as p6_3_low,
  sum(case when principle_score_6_3 >= 0.35 and principle_score_6_3 < 0.70 then 1 else 0 end) as p6_3_med,
  sum(case when principle_score_6_3 >= 0.70 then 1 else 0 end) as p6_3_high,
  sum(case when core_aspect_score_1 <= 1 then 1 else 0 end) as ca1_low,
  sum(case when core_aspect_score_1 = 2 then 1 else 0 end) as ca1_med,
  sum(case when core_aspect_score_1 >= 3 then 1 else 0 end) as ca1_high,
  sum(case when core_aspect_score_2 <= 1 then 1 else 0 end) as ca2_low,
  sum(case when core_aspect_score_2 = 2 then 1 else 0 end) as ca2_med,
  sum(case when core_aspect_score_2 >= 3 then 1 else 0 end) as ca2_high,
  sum(case when core_aspect_score_3 <= 1 then 1 else 0 end) as ca3_low,
  sum(case when core_aspect_score_3 = 2 then 1 else 0 end) as ca3_med,
  sum(case when core_aspect_score_3 >= 3 then 1 else 0 end) as ca3_high,
  sum(case when core_aspect_score_4 <= 1 then 1 else 0 end) as ca4_low,
  sum(case when core_aspect_score_4 = 2 then 1 else 0 end) as ca4_med,
  sum(case when core_aspect_score_4 >= 3 then 1 else 0 end) as ca4_high,
  sum(case when core_aspect_score_5 <= 1 then 1 else 0 end) as ca5_low,
  sum(case when core_aspect_score_5 = 2 then 1 else 0 end) as ca5_med,
  sum(case when core_aspect_score_5 >= 3 then 1 else 0 end) as ca5_high,
  sum(case when core_aspect_score_6 <= 1 then 1 else 0 end) as ca6_low,
  sum(case when core_aspect_score_6 = 2 then 1 else 0 end) as ca6_med,
  sum(case when core_aspect_score_6 >= 3 then 1 else 0 end) as ca6_high
FROM soproc_measurement
WHERE :where`;

// Overview of the same measurement, broken down by org rather than by tier: one
// row per office/unit/subunit, each principle as its mean score in percent.
const MEASUREMENT_RADAR_QUERY = `SELECT :org-field as org,
  count(*) as total,
  round(avg(principle_score_1) * 100) as p1,
  round(avg(principle_score_2) * 100) as p2,
  round(avg(principle_score_3) * 100) as p3,
  round(avg(principle_score_4) * 100) as p4,
  round(avg(principle_score_5) * 100) as p5,
  round(avg(principle_score_6) * 100) as p6
FROM soproc_measurement
WHERE :where
GROUP BY 1
ORDER BY 1`;

const MEASUREMENT_RADAR_HEADERS = [
  'משרד / יחידה<org',
  'מספר מכרזים שנמדדו<total',
  'עקרון 1 - מקבלי השירות במרכז<p1',
  'עקרון 2 - ניהול מוכוון תוצאות<p2',
  'עקרון 3 - חדשנות וגמישות<p3',
  'עקרון 4 - פיתוח ושימור ידע<p4',
  'עקרון 5 - המפעיל כשותף<p5',
  'עקרון 6 - תכנון כלכלי ותחרות<p6',
];

// The radar is drawn as plain SVG rather than through the plotly pipeline the
// other charts use: the CDN bundle we load (plotly-basic) has no scatterpolar
// trace, and plotly gives no way to hang a tooltip off an angular axis label.
// Coordinates live in the box below, matching the SVG viewBox, so the HTML
// principle labels overlaid on top can reuse them as percentages.
const RADAR_VIEWBOX = {width: 100, height: 62};
const RADAR_CENTER = {x: 50, y: 31};
const RADAR_RADIUS = 19;
const RADAR_RINGS = [25, 50, 75, 100];
// How far outside the outermost ring the top and bottom labels sit.
const RADAR_LABEL_GAP = 3;

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

  readonly MEASUREMENT_YEAR = '2025';
  readonly MEASUREMENT_MIN_TENDERS = 3;
  public measurementData: any = null;

  // The six principles, in order: short names for the radar's axes, with `side`
  // deciding where the label is anchored around the hexagon, plus the official
  // definition — shown as the radar's label tooltip and as the subtitle of each
  // box in the measurement tab's per-principle breakdown.
  readonly MEASUREMENT_PRINCIPLES = [
    {n: 1, label: 'מקבלי השירות במרכז', side: 'top',
     definition: 'השירות מספק מענה מותאם ומיטבי לצרכי קהל היעד על גווניו, ונותן להם קול בעיצוב השירות'},
    {n: 2, label: 'ניהול מוכוון תוצאות', side: 'right',
     definition: 'השירות מקיים תהליכי למידה ושיפור תמידיים על מנת להשיג תוצאות לקידום מטרותיו וכדי לספק שירות איכותי'},
    {n: 3, label: 'חדשנות וגמישות', side: 'right',
     definition: 'השירות פועל לאור חזית הידע בתחום, מגיב ומתעדכן בהתאם להתפתחויות בידע, לצרכים משתנים ולתוצאותיו הנמדדות'},
    {n: 4, label: 'פיתוח ושימור ידע', side: 'bottom',
     definition: 'ידע הנצבר במהלך ההתקשרות עובר בין המפעילים ומהמפעילים למשרד ומזין קבלת החלטות ותהליכי תכנון עתידיים'},
    {n: 5, label: 'המפעיל כשותף', side: 'left',
     definition: 'היחסים עם המפעיל מבוססים על אמון ומחויבות משותפת להענקת שירות איכותי'},
    {n: 6, label: 'תכנון כלכלי ותחרות', side: 'left',
     definition: 'התכנון הכלכלי ומודל התיחור והתמורה מתמרצים מתן שירות איכותי וניהול יעיל של ההתקשרות'},
  ];
  public measurementRadar: any[] = [];
  public measurementRadarTotal = 0;
  public measurementRadarQuery = '';
  readonly RADAR_VIEWBOX = `0 0 ${RADAR_VIEWBOX.width} ${RADAR_VIEWBOX.height}`;
  readonly RADAR_CENTER = RADAR_CENTER;

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
    if (ps.server()) return;
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
      if (fields.every((f) => this.parameters[f])) {
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
        // switchMap(() => this.colorscheme),
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
    this.fetchMeasurementData();
    this.fetchMeasurementRadar();
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
        const color = this.colorFor(scheme, d.name);
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

  // An org is keyed in the colorscheme either by its own name (offices) or by
  // its full path below the current level (units and subunits).
  private colorFor(scheme: any, name: string): string {
    if (scheme.hasOwnProperty(name)) {
      return this.COLORS[scheme[name]];
    }
    if (scheme.hasOwnProperty(`${this.levelKey}|${name}`)) {
      return this.COLORS[scheme[`${this.levelKey}|${name}`]];
    }
    console.log('MISSING VALUE', name);
    return this.COLORS[this.COLORS.length - 1];
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

  calcMeasurementWhere(): string {
    return this.levelCond;
  }

  private encodeQuery(query: string): string {
    return btoa(encodeURIComponent(query).replace(/%([0-9A-F]{2})/g, (_m, p1) => String.fromCharCode(parseInt(p1, 16))));
  }

  fetchMeasurementData() {
    if (this.ps.server()) return;
    const where = this.calcMeasurementWhere();
    const query = MEASUREMENT_QUERY.split(':where').join(where);
    const encoded = this.encodeQuery(query);
    this.api.getItemData(encoded, ['total'], [this.formatter('total')])
      .subscribe((result: any) => {
        const rows = result.rows || [];
        this.measurementData = rows.length > 0 ? rows[0] : null;
      });
  }

  fetchMeasurementRadar() {
    if (this.ps.server()) return;
    const query = this.replaceAll(MEASUREMENT_RADAR_QUERY, [
      {from: ':where', to: this.calcMeasurementWhere()},
      {from: ':org-field', to: `coalesce("${this.groupByLvl}", 'אחר')`},
    ]);
    this.measurementRadarQuery = this.encodeQuery(query);
    forkJoin([
      this.colorscheme,
      this.api.getItemData(this.measurementRadarQuery, ['org'], [this.formatter('org')])
    ]).subscribe(([scheme, result]: any[]) => {
      if (result.error) {
        console.log('ERROR', query, result.error);
      }
      const rows = result.rows || [];
      this.measurementRadarTotal = this.sum(rows.map((row: any) => +row.total));
      this.measurementRadar = rows.map((row: any) => {
        const values = this.MEASUREMENT_PRINCIPLES.map((p) => Math.round(+row['p' + p.n] || 0));
        return {
          name: row.org,
          total: +row.total,
          color: this.colorFor(scheme, row.org),
          values,
          points: this.radarPolygon(values),
          markers: values.map((value, i) => ({value, ...this.radarPoint(i, value / 100)})),
        };
      });
    });
  }

  get measurementRadarDownloadUrl(): string {
    return this.api.getDownloadUrlPost(
      'xlsx', MEASUREMENT_RADAR_HEADERS, `${this.item.page_title} / מידע על מדידת מכרזי רכש`);
  }

  private radarPoint(index: number, ratio: number) {
    // Principle 1 sits at the top and the rest follow clockwise, 60° apart.
    const angle = (index * 60 - 90) * Math.PI / 180;
    return {
      x: RADAR_CENTER.x + Math.cos(angle) * RADAR_RADIUS * ratio,
      y: RADAR_CENTER.y + Math.sin(angle) * RADAR_RADIUS * ratio,
    };
  }

  private radarPolygon(values: number[]): string {
    return values
      .map((value, i) => this.radarPoint(i, value / 100))
      .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
      .join(' ');
  }

  // The rings are the 25/50/75/100% hexagons; the spokes run from the centre out
  // to each principle's vertex; the scale labels climb the topmost spoke.
  readonly radarRings = RADAR_RINGS.map(
    (pct) => ({pct, points: this.radarPolygon(this.MEASUREMENT_PRINCIPLES.map(() => pct))}));

  readonly radarSpokes = this.MEASUREMENT_PRINCIPLES.map((_, i) => this.radarPoint(i, 1));

  readonly radarScaleLabels = [0, ...RADAR_RINGS].map((pct) => ({
    pct,
    x: RADAR_CENTER.x + 1.5,
    y: RADAR_CENTER.y - RADAR_RADIUS * pct / 100,
  }));

  // Percentage offsets for the HTML labels overlaid on the SVG: the top and
  // bottom ones are centred just clear of the outer ring, the side ones hug the
  // edge of the chart at the height of their own vertex.
  readonly radarLabels = this.MEASUREMENT_PRINCIPLES.map((principle, i) => ({
    ...principle,
    top: principle.side === 'bottom'
      ? `${(RADAR_CENTER.y + RADAR_RADIUS + RADAR_LABEL_GAP) / RADAR_VIEWBOX.height * 100}%` : 'auto',
    bottom: principle.side === 'top'
      ? `${(RADAR_VIEWBOX.height - (RADAR_CENTER.y - RADAR_RADIUS - RADAR_LABEL_GAP))
           / RADAR_VIEWBOX.height * 100}%` : 'auto',
    sideTop: `${this.radarPoint(i, 1).y / RADAR_VIEWBOX.height * 100}%`,
  }));

  // The denominator is the tenders that actually have a score for this row, not
  // every tender in the filter: a principle whose question was answered
  // "לא רלוונטי", or left blank, is emitted as NULL and falls into none of the
  // three buckets. Dividing by count(*) and then deriving high by subtraction
  // silently reported those tenders as "מקיים".
  private tierPcts(low: number, med: number, high: number) {
    const scored = low + med + high;
    if (!scored) return {lowPct: 0, medPct: 0, highPct: 0, lowCount: 0, medCount: 0, highCount: 0, scoredCount: 0};
    const lowPct = Math.round(low / scored * 100);
    const medPct = Math.round(med / scored * 100);
    return {lowPct, medPct, highPct: 100 - lowPct - medPct,
            lowCount: low, medCount: med, highCount: high, scoredCount: scored};
  }

  get principleData(): any[] {
    if (!this.measurementData) return [];
    const d = this.measurementData;
    return [
      {name: 'עקרון ראשון: מקבל השירות במרכז',                        ...this.tierPcts(+d.p1_low, +d.p1_med, +d.p1_high)},
      {name: 'עקרון שני: ניהול מוכוון תוצאות',                        ...this.tierPcts(+d.p2_low, +d.p2_med, +d.p2_high)},
      {name: 'עקרון שלישי: חדשנות וגמישות',                           ...this.tierPcts(+d.p3_low, +d.p3_med, +d.p3_high)},
      {name: 'עקרון רביעי: פיתוח ושימור ידע',                         ...this.tierPcts(+d.p4_low, +d.p4_med, +d.p4_high)},
      {name: 'עקרון חמישי: המפעיל כשותף',                             ...this.tierPcts(+d.p5_low, +d.p5_med, +d.p5_high)},
      {name: 'עקרון שישי: תכנון כלכלי ותחרות בשירות האיכות',          ...this.tierPcts(+d.p6_low, +d.p6_med, +d.p6_high)},
    ];
  }

  get principleAspects(): any[] {
    if (!this.measurementData) return [];
    const d = this.measurementData;
    return [
      {
        principleTitle: 'עקרון ראשון: מקבל השירות במרכז',
        aspects: [
          {name: 'השירות מותאם לצרכי כלל מקבלי השירות',                                                               isCore: false, ...this.tierPcts(+d.p1_1_low, +d.p1_1_med, +d.p1_1_high)},
          {name: 'למקבלי השירות יש קול בתהליך עיצוב השירות ולאורך מתן השירותים',                                      isCore: false, ...this.tierPcts(+d.p1_2_low, +d.p1_2_med, +d.p1_2_high)},
          {name: 'המידע על השירות מונגש למקבלי השירות כך שיוכלו למצות את זכויותיהם בשירות',                           isCore: false, ...this.tierPcts(+d.p1_3_low, +d.p1_3_med, +d.p1_3_high)},
          {name: 'נשמרת רציפות ויציבות במתן שירותים או קשר טיפולי',                                                   isCore: false, ...this.tierPcts(+d.p1_4_low, +d.p1_4_med, +d.p1_4_high)},
          {name: 'המכרז קובע הליכים הנותנים קול למקבלי השירות או משפחותיהם בעת הפעלת השירות',                         isCore: true,  ...this.tierPcts(+d.ca1_low, +d.ca1_med, +d.ca1_high)},
        ]
      },
      {
        principleTitle: 'עקרון שני: ניהול מוכוון תוצאות',
        aspects: [
          {name: 'השירות מוכוון להשגת תוצאות מוגדרות',                                                                isCore: false, ...this.tierPcts(+d.p2_1_low, +d.p2_1_med, +d.p2_1_high)},
          {name: 'יש לשירות מערך מדידה לבחינת מידת השגת התוצאות ומתבצע ניהול שירות מוכוון תוצאות',                  isCore: false, ...this.tierPcts(+d.p2_2_low, +d.p2_2_med, +d.p2_2_high)},
          {name: 'המכרז כולל הגדרה של המדדים על בסיסם יימדד מפעיל השירות כולל מדדי תוצאה מרכזיים',                  isCore: true,  ...this.tierPcts(+d.ca2_low, +d.ca2_med, +d.ca2_high)},
        ]
      },
      {
        principleTitle: 'עקרון שלישי: חדשנות וגמישות',
        aspects: [
          {name: 'מודל השירות משקף את חזית הידע',                                                                      isCore: false, ...this.tierPcts(+d.p3_1_low, +d.p3_1_med, +d.p3_1_high)},
          {name: 'מתאפשרת גמישות בהתאמת השירות לצרכים משתנים',                                                        isCore: false, ...this.tierPcts(+d.p3_2_low, +d.p3_2_med, +d.p3_2_high)},
          {name: 'המודל המכרזי מאפשר גמישות באופן אספקת השירות בהתאם לצרכים משתנים, בהלימה להנחיות המקצועיות',      isCore: true,  ...this.tierPcts(+d.ca3_low, +d.ca3_med, +d.ca3_high)},
        ]
      },
      {
        principleTitle: 'עקרון רביעי: פיתוח ושימור ידע',
        aspects: [
          {name: 'ידע המפותח והנצבר במהלך ההתקשרות מתועד באופן המאפשר שימור, שיתוף ולמידה ומועבר במלואו למשרד ו/או למפעיל מחליף', isCore: false, ...this.tierPcts(+d.p4_low, +d.p4_med, +d.p4_high)},
          {name: 'במכרז מעוגנת חובת המפעיל בנוגע לתיעוד ידע הנצבר אצלו וכולל סוגי הידע ואופן העברתם למשרד ו/או למפעיל המחליף במהלך ובתום התקשרות', isCore: true, ...this.tierPcts(+d.ca4_low, +d.ca4_med, +d.ca4_high)},
        ]
      },
      {
        principleTitle: 'עקרון חמישי: המפעיל כשותף',
        aspects: [
          {name: 'מתקיים שיח מקצועי רציף בין המשרד למפעילים בשלבי תכנון השירות ובמהלך מתן השירותים',                 isCore: false, ...this.tierPcts(+d.p5_low, +d.p5_med, +d.p5_high)},
          {name: 'המכרז כולל הליכים סדורים הנותנים קול למפעיל השירות לניהול שיח מקצועי ולהצפת צרכים מול המשרד',      isCore: true,  ...this.tierPcts(+d.ca5_low, +d.ca5_med, +d.ca5_high)},
        ]
      },
      {
        principleTitle: 'עקרון שישי: תכנון כלכלי ותחרות בשירות האיכות',
        aspects: [
          {name: 'הגברת התחרות בין מתמודדים בתקופת המכרוז',                                                            isCore: false, ...this.tierPcts(+d.p6_1_low, +d.p6_1_med, +d.p6_1_high)},
          {name: 'הגברת תחרות בין מפעילים במהלך חיי ההתקשרות',                                                        isCore: false, ...this.tierPcts(+d.p6_2_low, +d.p6_2_med, +d.p6_2_high)},
          {name: 'תכנון כלכלי ההולם את הצרכים הנדרשים למתן שירות איכותי',                                             isCore: false, ...this.tierPcts(+d.p6_3_low, +d.p6_3_med, +d.p6_3_high)},
          {name: 'המכרז כולל מודל תמרוץ למפעיל לעידוד שיפור איכות ויעילות השירות במהלך חיי ההתקשרות',                isCore: true,  ...this.tierPcts(+d.ca6_low, +d.ca6_med, +d.ca6_high)},
        ]
      },
    ].map((principle, i) => ({...principle, definition: this.MEASUREMENT_PRINCIPLES[i].definition}));
  }

  getCoreAspect(p: any): any {
    return p.aspects?.find((a: any) => a.isCore);
  }

}
