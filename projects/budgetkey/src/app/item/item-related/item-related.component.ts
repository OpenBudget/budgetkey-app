import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges } from '@angular/core';
import { Format } from '../../format';
import { PlatformService } from '../../common-components/platform.service';

// Group order, matching the indexer's sort
const KIND_ORDER = [
  'entities', 'gov_decisions', 'state_comptroller_audits', 'state_comptroller_issues', 'analysis',
  'budget', 'support_programs', 'activities', 'tenders', 'contract-spending', 'supports',
];

const KIND_LABELS: {[kind: string]: string} = {
  'entities': 'גופים',
  'gov_decisions': 'החלטות ממשלה',
  'state_comptroller_audits': 'דוחות מבקר המדינה',
  'state_comptroller_issues': 'ליקויים במעקב (מבקר המדינה)',
  'analysis': 'ניתוחים',
  'budget': 'סעיפי תקציב',
  'support_programs': 'תוכניות תמיכה',
  'activities': 'שירותים חברתיים',
  'tenders': 'מכרזים',
  'contract-spending': 'התקשרויות',
  'supports': 'תמיכות',
};

// Kinds that have an item page in this app. Entries of other kinds render as text, not links.
// Add the comptroller kinds once their pages land.
export const LINKABLE_KINDS = new Set([
  'entities', 'gov_decisions', 'analysis', 'budget', 'support_programs', 'activities',
  'tenders', 'contract-spending', 'supports',
]);

// Linkable kinds whose targets may have no page (e.g. issues not yet re-indexed). In the browser,
// each such entry is checked with /get/ and shown as text when it 404s.
const VERIFY_KINDS = new Set(['state_comptroller_issues']);

// Pages that don't show "פריטים קשורים": analysis pages already link everything they discuss inline
const SKIP_RELATED_KINDS = new Set(['analysis']);

type Side = 'related' | 'mentioned';

// Labels for a relation, depending on whether this page is the link's target ("mentioned in") or its source
const RELATION_LABELS: {[relation: string]: {mentioned: string, related: string}} = {
  budget_owner: {mentioned: 'הגוף המתוקצב', related: 'תקציב הגוף'},
  audited: {mentioned: 'גוף מבוקר', related: 'גוף מבוקר'},
  responsible: {mentioned: 'גוף אחראי', related: 'גוף אחראי'},
  subject: {mentioned: 'נושא הדוח / ההחלטה', related: 'נושא'},
  funded: {mentioned: 'מימון', related: 'מימון'},
  contractor: {mentioned: 'ספק / קבלן', related: 'ספק / קבלן'},
  cites: {mentioned: 'מצוטט', related: 'מאוזכר'},
  amends: {mentioned: 'תיקון החלטה', related: 'מתקנת את ההחלטה'},
  cancels: {mentioned: 'ביטול החלטה', related: 'מבטלת את ההחלטה'},
  follows_up: {mentioned: 'דוח המשך', related: 'דוח מקורי'},
  mentioned: {mentioned: 'אזכור', related: 'אזכור'},
};

// A ministry or authority and its own budget chapters: a structural link, shown on a line of its own
const OWNER_RELATION = 'budget_owner';

// Strongest first, as the indexer picks each entry's `relation`
const RELATION_STRENGTH = [
  'budget_owner', 'audited', 'subject', 'follows_up', 'amends', 'cancels', 'cites', 'responsible', 'funded', 'contractor', 'mentioned',
];

const COLLAPSED_SIZE = 5;
const PAGE_SIZE = 100;
const EXCERPT_PREFIX = /^\[[^\]]+\]\s*/;

interface Entry {
  doc_id: string;
  code?: string | null;
  kind: string;
  title: string;
  relation: string;
  relations?: string[];
  date?: string | null;
  excerpt?: string | null;
  part_id?: string | null;
  parts?: string[];
  year?: number | null;
  same_item?: boolean;
}

interface EntryView {
  docId: string;
  title: string;
  code: string;
  linkable: boolean;
  fragment: string | null;
  tag: string;
  tooltip: string;
  date: string;
  year: string;
  excerpt: string;
  findings: string;
}

interface Group {
  kind: string;
  label: string;
  entries: EntryView[];
  // Closed groups show only their heading; open ones show the first entries, or all when expanded
  open: boolean;
  expanded: boolean;
}

@Component({
    selector: 'app-item-related',
    templateUrl: './item-related.component.html',
    styleUrls: ['./item-related.component.less'],
    standalone: false
})
export class ItemRelatedComponent implements OnChanges {
  @Input() item: any;

  readonly collapsedSize = COLLAPSED_SIZE;

  // The budget's owner, or the owner's budget chapters
  owners: EntryView[] = [];
  ownersLabel = '';
  related: Group[] = [];
  mentioned: Group[] = [];
  // Budget pages: mentions of other connected items with the same code
  otherYears: Group[] = [];
  // Back-links not shown yet
  moreCount = 0;
  loading = false;
  loadError = false;

  private format = new Format();
  private ownEntries: Entry[] = [];
  private fullList: Entry[] | null = null;
  private fullTotal = 0;
  // Targets checked with /get/, and those that turned out to have no page
  private checked = new Set<string>();
  missing = new Set<string>();

  constructor(private http: HttpClient, private ps: PlatformService) {}

  get empty(): boolean {
    return !this.owners.length && !this.related.length && !this.mentioned.length && !this.otherYears.length;
  }

  ngOnChanges() {
    const item = this.item || {};
    this.fullList = null;
    this.openExcerpts.clear();
    this.loading = false;
    this.loadError = false;

    const isOwner = (e: Entry) => e?.relation === OWNER_RELATION;
    const relatedItems: Entry[] = item.related_items || [];
    const allMentions: Entry[] = item.mentioned_in || [];
    const ownedBudgets = relatedItems.filter(isOwner);
    const budgetOwners = allMentions.filter(isOwner);
    this.owners = [...ownedBudgets.map(e => this.view(e, 'related', false)), ...budgetOwners.map(e => this.view(e, 'mentioned', false))];
    this.ownersLabel = RELATION_LABELS[OWNER_RELATION][ownedBudgets.length ? 'related' : 'mentioned'];

    this.related = SKIP_RELATED_KINDS.has(this.pageKind) ? [] : this.groups(relatedItems.filter(e => !isOwner(e)), 'related');

    const mentionedIn: Entry[] = allMentions.filter(e => !isOwner(e));
    this.ownEntries = mentionedIn.filter(e => e.same_item !== false);
    this.mentioned = this.groups(this.ownEntries, 'mentioned');
    this.otherYears = this.groups(mentionedIn.filter(e => e.same_item === false), 'mentioned', true);
    this.moreCount = Math.max(0, (item.mentioned_in_count || 0) - allMentions.length);
  }

  get pageKind(): string {
    const docId: string = this.item?.doc_id || '';
    return docId.startsWith('org/') ? 'entities' : docId.split('/')[0];
  }

  // Excerpts are clamped to two lines; a click shows the whole passage
  openExcerpts = new Set<string>();

  toggleExcerpt(docId: string) {
    if (this.openExcerpts.has(docId)) {
      this.openExcerpts.delete(docId);
    } else {
      this.openExcerpts.add(docId);
    }
  }

  // Opening or closing a group's heading; a closed group reopens to its short list
  onToggle(group: Group, open: boolean) {
    group.open = open;
    if (!open) {
      group.expanded = false;
    }
  }

  toggle(group: Group) {
    group.expanded = !group.expanded;
  }

  // Fetch the rest of the back-links from the public DB, a page at a time
  loadMore() {
    if (this.loading) {
      return;
    }
    const item = this.item;
    const docId = (item.doc_id as string).replace(/'/g, `''`);
    // One row per source part: keep each source's strongest relation (the indexer's order), then the most confident row
    const query = `select * from (
        select distinct on (source_doc_id) source_doc_id, source_kind, source_title, source_date,
               source_part_id, target_year, relation, excerpt
        from related_items where target_doc_id = '${docId}' and relation <> '${OWNER_RELATION}'
        order by source_doc_id, array_position(array[${RELATION_STRENGTH.map(r => `'${r}'`).join(',')}], relation), confidence desc
      ) t order by source_date desc nulls last, source_doc_id`.replace(/\s+/g, ' ');
    const page = this.fullList ? Math.ceil(this.fullList.length / PAGE_SIZE) : 0;
    this.loading = true;
    this.loadError = false;
    this.http.get('https://next.obudget.org/api/query', {
      params: {query, page: String(page), page_size: String(PAGE_SIZE)}
    }).subscribe({
      next: (res: any) => {
        if (item !== this.item) {
          return;
        }
        this.loading = false;
        const known = new Map(this.ownEntries.map(e => [e.doc_id, e]));
        const rows: Entry[] = (res?.rows || []).map((row: any) => known.get(row.source_doc_id) || {
          doc_id: row.source_doc_id,
          kind: row.source_kind,
          title: row.source_title,
          date: row.source_date,
          relation: row.relation,
          relations: [row.relation],
          excerpt: row.excerpt,
          part_id: row.source_part_id,
          year: row.target_year,
        });
        this.fullList = [...(this.fullList || []), ...rows];
        this.fullTotal = res?.total || 0;
        if (!rows.length) {
          this.fullTotal = this.fullList.length;
        }
        this.mentioned = this.groups(this.fullList, 'mentioned');
        // The reader asked for everything: open and expand every group
        this.mentioned.forEach(g => g.open = g.expanded = true);
        this.moreCount = Math.max(0, this.fullTotal - this.fullList.length);
      },
      error: () => {
        this.loading = false;
        this.loadError = true;
      }
    });
  }

  private groups(entries: Entry[], side: Side, showYear = false): Group[] {
    const byKind = new Map<string, EntryView[]>();
    for (const entry of entries) {
      if (!entry?.doc_id) {
        continue;
      }
      if (!byKind.has(entry.kind)) {
        byKind.set(entry.kind, []);
      }
      byKind.get(entry.kind)!.push(this.view(entry, side, showYear));
    }
    const rank = (kind: string) => {
      const i = KIND_ORDER.indexOf(kind);
      return i < 0 ? KIND_ORDER.length : i;
    };
    return [...byKind.keys()]
      .sort((a, b) => rank(a) - rank(b))
      .map(kind => ({kind, label: KIND_LABELS[kind] || kind, entries: byKind.get(kind)!, open: false, expanded: false}));
  }

  private view(entry: Entry, side: Side, showYear: boolean): EntryView {
    const label = (relation: string) => RELATION_LABELS[relation]?.[side] || relation;
    const relations = (entry.relations?.length ? entry.relations : [entry.relation]).filter(r => !!r);
    // Budget years: on a budget page each back-link cites a specific year; budget targets carry theirs too
    const yearShown = entry.year && (showYear || this.pageKind === 'budget' || entry.kind === 'budget');
    let findings = '';
    if (side === 'related' && this.pageKind === 'state_comptroller_audits' && entry.parts?.length) {
      findings = 'בממצאים ' + entry.parts.map(p => p.split('-').pop()).join(', ');
    }
    const view: EntryView = {
      docId: entry.doc_id,
      title: entry.title || entry.doc_id,
      code: entry.code || '',
      linkable: LINKABLE_KINDS.has(entry.kind),
      fragment: entry.kind === 'state_comptroller_audits' && entry.part_id ? `finding-${entry.part_id}` : null,
      tag: entry.relation ? label(entry.relation) : '',
      tooltip: relations.map(label).join(', '),
      date: entry.date ? this.format.date(entry.date) : '',
      year: yearShown ? `(${entry.year})` : '',
      excerpt: side === 'mentioned' ? (entry.excerpt || '').replace(EXCERPT_PREFIX, '') : '',
      findings,
    };
    this.verify(view, entry.kind);
    return view;
  }

  // Show a target as text if its page turns out not to exist
  private verify(view: EntryView, kind: string) {
    if (!view.linkable || !VERIFY_KINDS.has(kind) || this.checked.has(view.docId) || !this.ps.browser()) {
      return;
    }
    this.checked.add(view.docId);
    this.http.get('https://next.obudget.org/get/' + view.docId).subscribe({
      error: (err) => {
        if (err?.status === 404) {
          this.missing.add(view.docId);
        }
      }
    });
  }
}
