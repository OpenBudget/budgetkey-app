import * as Showdown from 'showdown';

// Shared by the State Comptroller audit and issue pages

export const PUBLICATION_TYPES: {[type: string]: string} = {
  annual: 'דוח שנתי',
  special: 'דוח מיוחד',
};

export const FINDING_TYPES: {[type: string]: string} = {
  deficiency: 'ליקוי',
  positive: 'ממצא חיובי',
  observation: 'הערה',
};

export const SEVERITIES: {[severity: string]: string} = {
  high: 'חומרה גבוהה',
  medium: 'חומרה בינונית',
  low: 'חומרה נמוכה',
};

export const FOLLOW_UP_KINDS: {[kind: string]: string} = {
  follow_up_audit: 'ביקורת מעקב',
  includes_follow_up: 'כולל מעקב אחר ממצאים קודמים',
};

// Rectification status, from follow-up audits and from the government's responses.
// `tone` colours the badge as a traffic light.
export interface Status {
  label: string;
  tone: 'good' | 'fair' | 'poor' | 'bad' | 'neutral';
}

export const STATUSES: {[status: string]: Status} = {
  rectified: {label: 'תוקן', tone: 'good'},
  mostly_rectified: {label: 'תוקן במידה רבה', tone: 'fair'},
  partially_rectified: {label: 'תוקן חלקית', tone: 'poor'},
  not_rectified: {label: 'לא תוקן', tone: 'bad'},
  in_progress: {label: 'בטיפול', tone: 'neutral'},
  disputed: {label: 'הגוף חולק על הממצא', tone: 'bad'},
};

export function status(value: string | null | undefined): Status | null {
  return (value && STATUSES[value]) || null;
}

export const AUDITS_KIND = 'state_comptroller_audits';
export const ISSUES_KIND = 'state_comptroller_issues';

export function auditDocId(chapterId: number | string): string {
  return `${AUDITS_KIND}/${chapterId}`;
}

export function findingAnchor(findingId: string): string {
  return `finding-${findingId}`;
}

// Dates come as YYYY-MM-DD or YYYY-MM
export function partialDate(value: string | null | undefined): string {
  const m = (value || '').match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/);
  if (!m) {
    return value || '';
  }
  return m[3] ? `${m[3]}/${m[2]}/${m[1]}` : `${m[2]}/${m[1]}`;
}

// Report titles in earlier_reports and in related_items differ in punctuation and in a trailing " - <body>"
export function normalizeTitle(title: string | null | undefined): string {
  return (title || '').replace(/["'״׳()\-–,.:]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function titlesMatch(a: string | null | undefined, b: string | null | undefined): boolean {
  const na = normalizeTitle(a);
  const nb = normalizeTitle(b);
  return !!na && !!nb && (na === nb || na.startsWith(nb + ' ') || nb.startsWith(na + ' '));
}

// The chapter text: markdown with tables and ^n^ footnote marks
const chapterMarkdown = () => [
  {
    type: 'output',
    regex: /<table>([\s\S]*?)<\/table>/g,
    replace: '<div class="table-scroll"><table>$1</table></div>',
  },
  {
    type: 'output',
    regex: /\^(\d{1,3})\^/g,
    replace: '<sup>$1</sup>',
  },
  {
    type: 'output',
    regex: /<a href="(https?:[^"]+)"/g,
    replace: '<a href="$1" target="_blank" rel="noopener"',
  },
];

export function chapterConverter() {
  return new Showdown.Converter({
    extensions: [chapterMarkdown],
    tables: true,
    strikethrough: true,
    literalMidWordUnderscores: true,
    noHeaderId: true,
  });
}
