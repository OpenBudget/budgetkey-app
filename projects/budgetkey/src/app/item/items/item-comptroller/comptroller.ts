import * as Showdown from 'showdown';

// Shared by the State Comptroller audit and issue pages. Labels live in common-components, as search results use them too.

export { PUBLICATION_TYPES, FINDING_TYPES, SEVERITIES, FOLLOW_UP_KINDS, STATUSES, status } from '../../../common-components/comptroller-labels';
export type { Status } from '../../../common-components/comptroller-labels';

export const AUDITS_KIND = 'state_comptroller_audits';
export const ISSUES_KIND = 'state_comptroller_issues';

export function auditDocId(chapterId: number | string): string {
  return `${AUDITS_KIND}/${chapterId}`;
}

export function findingAnchor(findingId: string): string {
  return `finding-${findingId}`;
}

// Dates come as YYYY-MM-DD, YYYY-MM or YYYY
export function partialDate(value: string | null | undefined): string {
  const m = (value || '').match(/^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/);
  if (!m) {
    return value || '';
  }
  return m[3] ? `${m[3]}/${m[2]}/${m[1]}` : m[2] ? `${m[2]}/${m[1]}` : m[1];
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
    simplifiedAutoLink: true,
    excludeTrailingPunctuationFromURLs: true,
    strikethrough: true,
    literalMidWordUnderscores: true,
    noHeaderId: true,
  });
}

// Responses and findings are plain text, but some carry a markdown table: split the text into its lines and the tables between them
export interface TextBlock {
  line?: string;
  tableHtml?: string;
}

const TABLE_LINE = /^\|.*\|$/;
let tableConverter: Showdown.Converter | null = null;

export function textBlocks(text: string | null | undefined): TextBlock[] {
  const blocks: TextBlock[] = [];
  let table: string[] = [];
  const flush = () => {
    if (table.length) {
      tableConverter = tableConverter || chapterConverter();
      blocks.push({tableHtml: tableConverter.makeHtml(table.join('\n'))});
      table = [];
    }
  };
  for (const raw of (text || '').split('\n')) {
    const line = raw.trim();
    if (TABLE_LINE.test(line)) {
      table.push(line);
    } else {
      flush();
      if (line) {
        blocks.push({line});
      }
    }
  }
  flush();
  return blocks;
}

// Bare URLs in plain text, e.g. a response pointing to a ministry publication
export interface LinkPart {
  text: string;
  href?: string;
}

const URL_RE = /(?:https?:\/\/|www\.)[^\s<>"'״]+/g;
const TRAILING_PUNCTUATION = /[.,;:!?)\]]+$/;

export function linkParts(text: string | null | undefined): LinkPart[] {
  const value = text || '';
  const parts: LinkPart[] = [];
  let last = 0;
  for (const m of value.matchAll(URL_RE)) {
    const url = m[0].replace(TRAILING_PUNCTUATION, '');
    if (m.index! > last) {
      parts.push({text: value.slice(last, m.index)});
    }
    parts.push({text: url, href: url.startsWith('www.') ? `https://${url}` : url});
    last = m.index! + url.length;
  }
  if (last < value.length) {
    parts.push({text: value.slice(last)});
  }
  return parts;
}
