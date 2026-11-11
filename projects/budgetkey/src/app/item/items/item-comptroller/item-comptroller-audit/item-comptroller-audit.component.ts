import { AfterViewInit, Component, ElementRef, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';
import { Format } from '../../../../format';
import { PlatformService } from '../../../../common-components/platform.service';
import { SeoService } from '../../../../common-components/seo.service';
import {
  AUDITS_KIND, FINDING_TYPES, FOLLOW_UP_KINDS, ISSUES_KIND, PUBLICATION_TYPES, SEVERITIES, Status,
  chapterConverter, findingAnchor, partialDate, status, titlesMatch,
} from '../comptroller';

const MAX_KEY_FIGURES = 8;

interface FindingView {
  finding: any;
  anchor: string;
  type: string;
  typeLabel: string;
  severity: string;
  status: Status | null;
  issueDocId: string | null;
}

interface Section {
  title: string | null;
  findings: FindingView[];
}

interface Reference {
  report: string;
  year: number | null;
  title: string;
  docId: string | null;
}

interface FileLink {
  label: string;
  url: string;
}

@Component({
    selector: 'app-item-comptroller-audit',
    templateUrl: './item-comptroller-audit.component.html',
    styleUrls: ['./item-comptroller-audit.component.less'],
    standalone: false
})
export class ItemComptrollerAuditComponent implements OnChanges, AfterViewInit {
  @Input() item: any;

  format = new Format();
  partialDate = partialDate;
  sections: Section[] = [];
  keyFigures: {label: string, value: string}[] = [];
  followUpLabel = '';
  original: Reference | null = null;
  earlierReports: Reference[] = [];
  files: FileLink[] = [];
  // The finding a link pointed at
  target = '';

  // The full text is long: it's converted only when the reader opens it, so it's never in the SSR HTML
  textOpen = false;
  textHtml = '';
  private converter = chapterConverter();

  constructor(private seo: SeoService, private route: ActivatedRoute, private el: ElementRef, private ps: PlatformService) {}

  ngOnChanges() {
    const item = this.item || {};
    this.seo.setDescription(item.summary);
    this.textOpen = false;
    this.textHtml = '';

    this.keyFigures = (item.key_figures || []).filter((f: any) => f?.label && f?.value).slice(0, MAX_KEY_FIGURES);
    this.sections = this.groupFindings(item);

    // earlier_reports entries carry the doc_id of the audit's page (null when it has none).
    // Documents indexed before that field existed fall back to matching related_items by title.
    const audits = ((item.related_items || []) as any[]).filter(r => r.kind === AUDITS_KIND);
    const docIdFor = (ref: any) => {
      if (ref && 'doc_id' in ref) {
        return ref.doc_id || null;
      }
      const matches = audits.filter(r => titlesMatch(r.title, ref?.title));
      const preferred = ref?.relation === 'followed_up' ? 'follows_up' : null;
      return (matches.find(r => r.relation === preferred) || matches[0])?.doc_id || null;
    };
    const toReference = (ref: any): Reference => ({report: ref.report || '', year: ref.year, title: ref.title || '', docId: docIdFor(ref)});

    const refs = ((item.earlier_reports || []) as any[]).filter(r => r?.title || r?.report);
    this.followUpLabel = (item.follow_up && FOLLOW_UP_KINDS[item.follow_up]) || '';
    this.original = null;
    let originalRef: any = null;
    if (this.followUpLabel && (item.follows_up_title || item.follows_up_report)) {
      // follows_up_* describe the first followed_up reference
      originalRef = refs.find(r => r.relation === 'followed_up') ||
        {title: item.follows_up_title, report: item.follows_up_report, year: item.follows_up_year, relation: 'followed_up'};
      this.original = toReference(originalRef);
    }
    // The original audit is already named above
    this.earlierReports = refs.filter(r => r !== originalRef).map(toReference);

    this.files = [
      {label: 'הפרק המלא (PDF)', url: item.pdf_url},
      {label: 'הפרק המלא (Word)', url: item.docx_url},
      {label: 'תקציר (PDF)', url: item.abstract_pdf_url},
      {label: 'תקציר (Word)', url: item.abstract_docx_url},
      {label: 'המסמך המקורי באתר מבקר המדינה', url: item.source_url},
    ].filter(f => !!f.url);
  }

  ngAfterViewInit() {
    // Back-links point at #finding-<id>. The router's anchor scrolling runs before the item loads, so scroll here.
    this.route.fragment.pipe(first()).subscribe((fragment) => {
      if (!fragment?.startsWith('finding-')) {
        return;
      }
      this.target = fragment;
      this.ps.browser(() => {
        setTimeout(() => {
          const el = (this.el.nativeElement as HTMLElement).querySelector(`[id="${CSS.escape(fragment)}"]`);
          el?.scrollIntoView({block: 'start'});
        }, 0);
      });
    });
  }

  get publicationType(): string {
    return PUBLICATION_TYPES[this.item?.publication_type] || '';
  }

  get otherBodies(): string[] {
    return (this.item?.audited_bodies || []).filter((b: string) => b !== this.item?.main_body);
  }

  // The report's name, next to the title, unless it's the title already or repeats it
  reportName(ref: Reference): string {
    return ref.title && ref.report && !ref.report.includes(ref.title) ? ref.report : '';
  }

  get showFindings(): boolean {
    return this.item?.analysis_status !== 'no-findings' && this.sections.length > 0;
  }

  onTextToggle(open: boolean) {
    this.textOpen = open;
    if (open && !this.textHtml) {
      this.textHtml = this.converter.makeHtml(this.item?.text || '');
    }
  }

  private groupFindings(item: any): Section[] {
    const findings = [...(item.findings || [])].sort((a: any, b: any) => (a.seq || 0) - (b.seq || 0));
    const sections: Section[] = [];
    for (const finding of findings) {
      const view: FindingView = {
        finding,
        anchor: findingAnchor(finding.finding_id),
        type: finding.finding_type || 'deficiency',
        typeLabel: FINDING_TYPES[finding.finding_type] || '',
        severity: finding.finding_type === 'deficiency' ? (SEVERITIES[finding.severity] || '') : '',
        status: finding.followup_status === 'not_applicable' ? null : status(finding.followup_status),
        // Single-finding issues have no page
        issueDocId: finding.issue_id && finding.issue_size > 1 ? `${ISSUES_KIND}/${finding.issue_id}` : null,
      };
      // Consecutive findings of the same section share a heading
      const last = sections[sections.length - 1];
      const title = finding.section || null;
      if (last && last.title === title) {
        last.findings.push(view);
      } else {
        sections.push({title, findings: [view]});
      }
    }
    return sections;
  }
}
